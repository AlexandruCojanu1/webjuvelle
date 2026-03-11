const VERCEL_API_BASE = 'https://api.vercel.com'

function vercelHeaders() {
    return {
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
    }
}

function teamQuery() {
    return process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : ''
}

// Create a new Vercel project linked to a GitHub repo and trigger a deployment
export async function deployToVercel(
    repoName: string,
    githubOwner: string
): Promise<{ projectId: string; deploymentUrl: string }> {
    // 1. Create Vercel project linked to the GitHub repo
    const createRes = await fetch(`${VERCEL_API_BASE}/v10/projects${teamQuery()}`, {
        method: 'POST',
        headers: vercelHeaders(),
        body: JSON.stringify({
            name: repoName,
            framework: 'astro',
            gitRepository: {
                type: 'github',
                repo: `${githubOwner}/${repoName}`,
            },
        }),
    })

    if (!createRes.ok) {
        const err = await createRes.text()
        throw new Error(`Failed to create Vercel project: ${err}`)
    }

    const project = await createRes.json()
    const projectId: string = project.id

    // 2. Trigger an initial deployment
    const deployRes = await fetch(`${VERCEL_API_BASE}/v13/deployments${teamQuery()}`, {
        method: 'POST',
        headers: vercelHeaders(),
        body: JSON.stringify({
            name: repoName,
            gitSource: {
                type: 'github',
                repo: `${githubOwner}/${repoName}`,
                ref: 'main',
            },
            projectId,
        }),
    })

    if (!deployRes.ok) {
        const err = await deployRes.text()
        throw new Error(`Failed to trigger Vercel deploy: ${err}`)
    }

    const deployment = await deployRes.json()

    // 3. Skip polling to prevent 60s serverless timeout on Vercel Hobby tier.
    // The link will be valid once Vercel finishes building in the background.
    const deploymentUrl = `https://${deployment.url}`

    return { projectId, deploymentUrl }
}

// Poll Vercel until deployment status is READY or ERROR
async function pollDeployment(
    deploymentId: string,
    maxAttempts: number,
    intervalMs: number
): Promise<string> {
    for (let i = 0; i < maxAttempts; i++) {
        await new Promise(r => setTimeout(r, intervalMs))

        const res = await fetch(
            `${VERCEL_API_BASE}/v13/deployments/${deploymentId}${teamQuery()}`,
            { headers: vercelHeaders() }
        )
        const data = await res.json()

        if (data.state === 'READY') {
            return `https://${data.url}`
        }
        if (data.state === 'ERROR' || data.state === 'CANCELED') {
            throw new Error(`Deployment failed with state: ${data.state}`)
        }
    }

    throw new Error('Deployment timed out after 3 minutes.')
}

// Re-deploy an existing Vercel project (after a GitHub repo update)
export async function redeployProject(projectId: string, repoName: string): Promise<string> {
    const deployRes = await fetch(`${VERCEL_API_BASE}/v13/deployments${teamQuery()}`, {
        method: 'POST',
        headers: vercelHeaders(),
        body: JSON.stringify({
            name: repoName,
            projectId,
            gitSource: {
                type: 'github',
                repo: `${process.env.GITHUB_DEPLOY_ORG}/${repoName}`,
                ref: 'main',
            },
        }),
    })

    const deployment = await deployRes.json()
    // Skip polling to prevent serverless timeout on Vercel Hobby tier
    return `https://${deployment.url}`
}

// Add a custom domain to a Vercel project
export async function addDomainToProject(
    projectId: string,
    domain: string
): Promise<void> {
    const res = await fetch(
        `${VERCEL_API_BASE}/v10/projects/${projectId}/domains${teamQuery()}`,
        {
            method: 'POST',
            headers: vercelHeaders(),
            body: JSON.stringify({ name: domain }),
        }
    )

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`Failed to add domain: ${err}`)
    }
}

// Check if a domain is available for purchase via Vercel
export async function checkDomainAvailability(
    domain: string
): Promise<{ available: boolean; price?: number }> {
    const res = await fetch(
        `${VERCEL_API_BASE}/v4/domains/status?name=${domain}${teamQuery().replace('?', '&')}`,
        { headers: vercelHeaders() }
    )
    const data = await res.json()
    return {
        available: data.available,
        price: data.price,
    }
}

// Purchase a domain via Vercel
export async function purchaseDomain(domain: string): Promise<void> {
    const res = await fetch(`${VERCEL_API_BASE}/v4/domains/buy${teamQuery()}`, {
        method: 'POST',
        headers: vercelHeaders(),
        body: JSON.stringify({ name: domain, expectedPrice: undefined }),
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`Failed to purchase domain: ${err}`)
    }
}

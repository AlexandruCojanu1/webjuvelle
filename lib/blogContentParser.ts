/**
 * Extracts body content, styles, and scripts from a full HTML document
 * This prevents hydration errors by removing DOCTYPE, html, head, and body tags
 */
export function parseBlogContent(fullHtml: string): {
  bodyContent: string;
  styles: string;
  scripts: string;
  fontLinks: Array<{ href: string; rel: string; as?: string; crossorigin?: string }>;
} {
  let bodyContent = fullHtml;
  let styles = '';
  let scripts = '';
  const fontLinks: Array<{ href: string; rel: string; as?: string; crossorigin?: string }> = [];

  // Remove DOCTYPE if present
  bodyContent = bodyContent.replace(/<!DOCTYPE[^>]*>/gi, '');
  
  // Extract and remove <head> content (styles, scripts, links)
  const headMatch = bodyContent.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (headMatch) {
    const headContent = headMatch[1];
    
    // Extract <style> tags
    const styleMatches = headContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (styleMatches) {
      styles = styleMatches
        .map(match => match.replace(/<\/?style[^>]*>/gi, ''))
        .join('\n');
      
      // Remove body background-color rule to prevent white background issue
      // Replace it with a scoped class instead
      styles = styles.replace(/body\s*\{[^}]*background-color:\s*#ffffff[^}]*\}/gi, '');
      styles = styles.replace(/body\s*\{[^}]*background-color:\s*white[^}]*\}/gi, '');
      
      // Scope body styles to .blog-post-content instead
      styles = styles.replace(/body\s*\{/gi, '.blog-post-content {');
    }
    
    // Extract <link> tags for fonts
    const linkMatches = headContent.match(/<link[^>]*>/gi);
    if (linkMatches) {
      linkMatches.forEach(linkTag => {
        const hrefMatch = linkTag.match(/href=["']([^"']+)["']/i);
        const relMatch = linkTag.match(/rel=["']([^"']+)["']/i);
        const asMatch = linkTag.match(/as=["']([^"']+)["']/i);
        const crossoriginMatch = linkTag.match(/crossorigin=["']([^"']+)["']/i);
        
        if (hrefMatch && relMatch) {
          fontLinks.push({
            href: hrefMatch[1],
            rel: relMatch[1],
            as: asMatch ? asMatch[1] : undefined,
            crossorigin: crossoriginMatch ? crossoriginMatch[1] : undefined,
          });
        }
      });
    }
    
    // Remove head tag
    bodyContent = bodyContent.replace(/<head[^>]*>[\s\S]*?<\/head>/i, '');
  }
  
  // Extract and remove <html> tag
  bodyContent = bodyContent.replace(/<\/?html[^>]*>/gi, '');
  
  // Extract <body> content (without the body tag itself)
  const bodyMatch = bodyContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    bodyContent = bodyMatch[1];
  }
  
  // Extract <script> tags from body content
  const scriptMatches = bodyContent.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
  if (scriptMatches) {
    scripts = scriptMatches
      .map(match => match.replace(/<\/?script[^>]*>/gi, ''))
      .join('\n');
    
    // Remove script tags from body content
    bodyContent = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  }
  
  // Clean up any remaining whitespace
  bodyContent = bodyContent.trim();
  
  return {
    bodyContent,
    styles,
    scripts,
    fontLinks,
  };
}


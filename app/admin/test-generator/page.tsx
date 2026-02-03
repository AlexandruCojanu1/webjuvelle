'use client';

import { useState } from 'react';

export default function TestGeneratorPage() {
    const [niche, setNiche] = useState('');
    const [city, setCity] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('/api/generate-titles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ niche, city }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'A apărut o eroare la generare');
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Eroare necunoscută');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5" style={{ marginTop: '100px' }}>
            <h1>Test Generator Titluri (Gemini)</h1>
            <p className="mb-4">Această pagină este pentru testarea integrării cu Gemini API.</p>

            <div className="row">
                <div className="col-md-6">
                    <div className="card bg-dark text-white p-4">
                        <form onSubmit={handleGenerate}>
                            <div className="mb-3">
                                <label className="form-label">Tip Afacere (Niche)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={niche}
                                    onChange={(e) => setNiche(e.target.value)}
                                    placeholder="Ex: Dentist, Service Auto, etc."
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Oraș (City)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Ex: Brașov, București"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? 'Se generează...' : 'Generează Titluri'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-md-6">
                    {error && (
                        <div className="alert alert-danger mt-3 mt-md-0" role="alert">
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="card bg-secondary text-white p-4 mt-3 mt-md-0">
                            <h4>Rezultat JSON:</h4>
                            <pre className="bg-dark p-3 rounded" style={{ overflowX: 'auto' }}>
                                {JSON.stringify(result, null, 2)}
                            </pre>

                            <div className="mt-4">
                                <h5>Meta Titles:</h5>
                                <ul>
                                    {result.metaTitles?.map((title: string, index: number) => (
                                        <li key={index}>{title}</li>
                                    ))}
                                </ul>

                                <h5 className="mt-3">H1 Titles (Human):</h5>
                                <ul>
                                    {result.humanTitles?.map((title: string, index: number) => (
                                        <li key={index}>{title}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

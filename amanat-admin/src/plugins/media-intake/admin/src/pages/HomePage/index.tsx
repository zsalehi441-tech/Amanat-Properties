import React, { useState } from 'react';
import { Box, Typography, Loader, SingleSelect, SingleSelectOption, Field, Flex, Button } from '@strapi/design-system';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ArrowLeft, File, Plus } from '@strapi/icons';

// --- Components ---

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <Box padding={10} background="neutral100" height="100vh">
            <Box paddingBottom={8}>
                <Typography variant="alpha" as="h1">Media Intake Service</Typography>
                <Typography variant="epsilon" style={{ color: '#666' }}>Select the type of media you want to upload</Typography>
            </Box>

            <Flex gap={6} wrap="wrap">
                <Box
                    background="neutral0"
                    shadow="tableShadow"
                    padding={8}
                    hasRadius
                    cursor="pointer"
                    borderColor="neutral200"
                    width="300px"
                    onClick={() => navigate('property')}
                    style={{ textAlign: 'center', transition: 'transform 0.2s', border: '1px solid #dcdce4' }}
                    onMouseEnter={(e: any) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e: any) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Flex justifyContent="center" paddingBottom={4}>
                        <File style={{ width: '3rem', height: '3rem', fill: '#4945ff' }} />
                    </Flex>
                    <Typography variant="beta" as="h3">Property Photos</Typography>
                    <Box paddingTop={2}>
                        <Typography variant="pi" style={{ color: '#666' }}>Upload high-res images for property listings.</Typography>
                    </Box>
                    <Box paddingTop={6}>
                        <Button fullWidth variant="default">Select Property</Button>
                    </Box>
                </Box>

                <Box
                    background="neutral0"
                    shadow="tableShadow"
                    padding={8}
                    hasRadius
                    cursor="pointer"
                    borderColor="neutral200"
                    width="300px"
                    onClick={() => navigate('document')}
                    style={{ textAlign: 'center', transition: 'transform 0.2s', border: '1px solid #dcdce4' }}
                    onMouseEnter={(e: any) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e: any) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Flex justifyContent="center" paddingBottom={4}>
                        <File style={{ width: '3rem', height: '3rem', fill: '#007eff' }} />
                    </Flex>
                    <Typography variant="beta" as="h3">Private Documents</Typography>
                    <Box paddingTop={2}>
                        <Typography variant="pi" textColor="neutral600">Securely upload deeds, IDs, and legal docs.</Typography>
                    </Box>
                    <Box paddingTop={6}>
                        <Button fullWidth variant="secondary">Select Documents</Button>
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
};

const PropertyUpload = () => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleBulkUpload = async (files: File[]) => {
        setUploading(true);
        setError(null);
        setResult(null);

        const results = [];
        const errors = [];

        for (const file of files) {
            try {
                // Upload directly - server handles optimization via sharp
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/media-intake/property', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || `HTTP ${response.status}`);
                }

                const data = await response.json();
                results.push({ file: file.name, data: data });
            } catch (err: any) {
                console.error('Upload Error:', err);
                errors.push({ file: file.name, error: err.message || 'Unknown error' });
            }
        }

        setUploading(false);

        if (errors.length > 0) {
            const errorDetails = errors.map(e => `• ${e.file}: ${e.error}`).join('\n');
            setError(`Failed to upload ${errors.length} file(s):\n${errorDetails}`);
        }

        if (results.length > 0) {
            setResult({ count: results.length, uploads: results });
        }
    };

    return (
        <Box padding={8} background="neutral100" minHeight="100vh">
            <Button variant="tertiary" startIcon={<ArrowLeft />} onClick={() => navigate('..')}>Back</Button>
            <Box paddingTop={6} paddingBottom={4}>
                <Typography variant="alpha">Property Photos</Typography>
            </Box>

            <Box padding={6} background="neutral0" shadow="filterShadow" hasRadius maxWidth="600px">
                <Box paddingBottom={4}>
                    <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '8px' }}>
                        Accepted formats: JPG, PNG, WEBP. Max size: 10MB per file.
                    </Typography>
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        multiple
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                handleBulkUpload(Array.from(e.target.files));
                            }
                        }}
                        disabled={uploading}
                        style={{ display: 'block', width: '100%', padding: '12px', border: '1px dashed #ccc', borderRadius: '4px' }}
                    />
                </Box>

                {uploading && <Box paddingTop={2}><Loader>Uploading...</Loader></Box>}
                {error && (
                    <Box paddingTop={2} padding={4} background="danger100" borderColor="danger200" hasRadius>
                        <Typography textColor="danger600" fontWeight="bold">Upload Failed:</Typography>
                        <Box paddingTop={1}>
                            {error.split('\n').map((errLine, i) => (
                                <Typography key={i} style={{ display: 'block' }} textColor="danger600" variant="pi">{errLine}</Typography>
                            ))}
                        </Box>
                    </Box>
                )}

                {result && (
                    <Box paddingTop={4}>
                        <Typography variant="delta" textColor="success600">
                            {result.count} Photo(s) Uploaded Successfully!
                        </Typography>
                        <Box paddingTop={4}>
                            {result.uploads.map((u: any, i: number) => (
                                <Box key={i} paddingTop={3} padding={4} background="neutral100" hasRadius style={{ marginBottom: '12px' }}>
                                    <Typography variant="omega" fontWeight="bold" style={{ marginBottom: '8px', display: 'block' }}>
                                        📷 {u.file}
                                    </Typography>
                                    <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '4px' }}>
                                        <strong>ID:</strong> {u.data.id}
                                    </Typography>
                                    {u.data.variants && (
                                        <Box paddingTop={2}>
                                            <Typography variant="pi" fontWeight="bold" style={{ marginBottom: '8px', display: 'block' }}>
                                                📎 Media URLs:
                                            </Typography>
                                            {Object.entries(u.data.variants).map(([variant, url]) => (
                                                <Flex key={variant} gap={2} alignItems="center" style={{ marginBottom: '6px' }}>
                                                    <Typography variant="pi" textColor="neutral600" style={{ minWidth: '50px' }}>
                                                        {variant}:
                                                    </Typography>
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={url as string}
                                                        style={{
                                                            flex: 1,
                                                            padding: '6px 10px',
                                                            fontSize: '12px',
                                                            border: '1px solid #dcdce4',
                                                            borderRadius: '4px',
                                                            background: '#fff',
                                                            fontFamily: 'monospace'
                                                        }}
                                                        onClick={(e) => (e.target as HTMLInputElement).select()}
                                                    />
                                                    <Button
                                                        variant="tertiary"
                                                        size="S"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(url as string);
                                                        }}
                                                    >
                                                        Copy
                                                    </Button>
                                                </Flex>
                                            ))}
                                        </Box>
                                    )}
                                    {u.data.meta && (
                                        <Box paddingTop={2}>
                                            <Typography variant="pi" textColor="neutral500" style={{ fontSize: '11px' }}>
                                                Size: {(u.data.meta.size / 1024).toFixed(1)} KB |
                                                Dimensions: {u.data.meta.width}×{u.data.meta.height}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

const DocumentUpload = () => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [docType, setDocType] = useState('other');

    const handleUpload = async (file: File) => {
        setUploading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('docType', docType);

        try {
            // Use custom API endpoint
            const response = await fetch('/api/media-intake/document', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP ${response.status}`);
            }

            const data = await response.json();
            setResult({ data });
        } catch (err: any) {
            console.error('Document Upload Error:', err);
            setError(err.message || 'Upload Failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box padding={8} background="neutral100" minHeight="100vh">
            <Button variant="tertiary" startIcon={<ArrowLeft />} onClick={() => navigate('..')}>Back</Button>
            <Box paddingTop={6} paddingBottom={4}>
                <Typography variant="alpha">Private Documents</Typography>
            </Box>

            <Box padding={6} background="neutral0" shadow="filterShadow" hasRadius maxWidth="500px">
                <Box paddingBottom={4}>
                    <Field.Root name="doc-type">
                        <Field.Label>Document Type</Field.Label>
                        <SingleSelect
                            placeholder="Select type..."
                            value={docType}
                            onChange={(val: any) => setDocType(val)}
                            disabled={uploading}
                        >
                            <SingleSelectOption value="qabala_sharhi">Qabala Sharhi (Deed)</SingleSelectOption>
                            <SingleSelectOption value="qabala_mahali">Qabala Mahali (Local)</SingleSelectOption>
                            <SingleSelectOption value="owner_id">Owner ID (Tazkira)</SingleSelectOption>
                            <SingleSelectOption value="qariadar_stamp">Qariadar Stamp</SingleSelectOption>
                            <SingleSelectOption value="gov_stamp">Gov Stamp</SingleSelectOption>
                            <SingleSelectOption value="other">Other</SingleSelectOption>
                        </SingleSelect>
                    </Field.Root>
                </Box>

                <Box paddingBottom={4}>
                    <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '8px' }}>
                        Accepted: PDF, JPG, PNG. Max size: 20MB.
                    </Typography>
                    <input
                        type="file"
                        accept=".pdf,image/png,image/jpeg,image/webp"
                        onChange={(e) => {
                            if (e.target.files?.[0]) handleUpload(e.target.files[0]);
                        }}
                        disabled={uploading}
                        style={{ display: 'block', width: '100%', padding: '12px', border: '1px dashed #ccc', borderRadius: '4px' }}
                    />
                </Box>

                {uploading && <Box paddingTop={2}><Loader>Securing Document...</Loader></Box>}
                {error && (
                    <Box paddingTop={2} padding={4} background="danger100" borderColor="danger200" hasRadius>
                        <Typography textColor="danger600">{error}</Typography>
                    </Box>
                )}

                {result && (
                    <Box paddingTop={4}>
                        <Typography variant="delta" textColor="success600">Document Secured!</Typography>
                        <Typography variant="omega">ID: {result.data.id}</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

// --- Main Router ---

export default function HomePage() {
    return (
        <Routes>
            <Route index element={<LandingPage />} />
            <Route path="property" element={<PropertyUpload />} />
            <Route path="document" element={<DocumentUpload />} />
        </Routes>
    );
}

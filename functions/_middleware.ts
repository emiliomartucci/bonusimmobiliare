/**
 * Cloudflare Pages Middleware
 * v1.0.0 - 2026-01-20
 *
 * Adds X-Robots-Tag: noindex for .pages.dev preview domains
 * to prevent search engine indexing of preview deployments.
 */

export const onRequest: PagesFunction = async (context) => {
    const response = await context.next();
    const url = new URL(context.request.url);

    // Add noindex header for .pages.dev domains (preview deployments)
    if (url.hostname.endsWith('.pages.dev')) {
        const newResponse = new Response(response.body, response);
        newResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
        return newResponse;
    }

    return response;
};

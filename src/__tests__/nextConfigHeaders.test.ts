import { describe, expect, it } from "vitest";
import nextConfig, {
  buildCspHeader,
  getSecurityHeaders,
} from "../../next.config";

describe("next.config.ts — Security Headers & CSP (SEC-02 / SEC-04)", () => {
  it("disables X-Powered-By header", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });

  it("defines production CSP with least-privilege directives and without unsafe-eval or blob:", () => {
    const prodCsp = buildCspHeader(false);
    const directives = prodCsp.split("; ");
    const directiveNames = directives.map((d) => d.split(" ")[0]);

    // No duplicate directives
    expect(new Set(directiveNames).size).toBe(directiveNames.length);

    expect(directives).toEqual([
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "frame-src 'none'",
      "upgrade-insecure-requests",
    ]);

    expect(prodCsp).not.toContain("'unsafe-eval'");
    expect(prodCsp).not.toContain("blob:");
    expect(prodCsp).not.toContain("*");
  });

  it("includes unsafe-eval and omits upgrade-insecure-requests only in development mode", () => {
    const devCsp = buildCspHeader(true);
    const directives = devCsp.split("; ");

    expect(directives).toContain(
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    );
    expect(directives).not.toContain("upgrade-insecure-requests");
  });

  it("returns all mandatory HTTP security headers for /:path*", async () => {
    expect(nextConfig.headers).toBeDefined();
    const headerRules = await nextConfig.headers!();

    expect(headerRules).toHaveLength(1);
    expect(headerRules[0].source).toBe("/:path*");

    const headersMap = Object.fromEntries(
      headerRules[0].headers.map((h) => [h.key, h.value]),
    );

    expect(Object.keys(headersMap)).toEqual([
      "Content-Security-Policy",
      "X-Frame-Options",
      "X-Content-Type-Options",
      "Referrer-Policy",
      "Permissions-Policy",
    ]);

    expect(headersMap["X-Frame-Options"]).toBe("DENY");
    expect(headersMap["X-Content-Type-Options"]).toBe("nosniff");
    expect(headersMap["Referrer-Policy"]).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(headersMap["Permissions-Policy"]).toBe(
      "camera=(), microphone=(), geolocation=(), browsing-topics=()",
    );
    expect(headersMap["Content-Security-Policy"]).toBe(buildCspHeader());
    expect(getSecurityHeaders(false)[0].value).toBe(buildCspHeader(false));
  });
});

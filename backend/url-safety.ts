/**
 * Validate HTTP(S) URLs used for displayed research-source links.
 *
 * This is a static URL validator, not an SSRF-proof fetch client. Do not use
 * it as the sole control before making server-side requests: DNS resolution,
 * redirects, and the fetch implementation must be controlled separately.
 */
export function safeHttpUrl(value: unknown): URL | null {
  if (typeof value !== "string" || value.length === 0 || value.length > 2000) return null;

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    if (parsed.username || parsed.password) return null;

    const host = parsed.hostname.toLowerCase();
    const unbracketedHost = host.startsWith("[") && host.endsWith("]")
      ? host.slice(1, -1)
      : host;

    if (!unbracketedHost) return null;

    // A single trailing dot is valid DNS syntax. Reject repeated trailing
    // dots so malformed names cannot bypass local/special-use suffix checks.
    const dnsHost = unbracketedHost.replace(/\.$/, "");
    if (!dnsHost || dnsHost.endsWith(".")) return null;
    if (
      dnsHost === "localhost" ||
      dnsHost.endsWith(".localhost") ||
      dnsHost.endsWith(".local") ||
      dnsHost.endsWith(".internal") ||
      dnsHost.endsWith(".test") ||
      dnsHost.endsWith(".invalid") ||
      dnsHost.endsWith(".example") ||
      dnsHost === "metadata" ||
      dnsHost === "metadata.google.internal" ||
      dnsHost === "instance-data.ec2.internal" ||
      dnsHost === "host.docker.internal"
    ) return null;

    // WHATWG URL normalizes many alternate IPv4 notations (octal, hex,
    // single-integer) into dotted-decimal notation before hostname is read.
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(dnsHost)) {
      const octets = dnsHost.split(".").map(Number);
      if (octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return null;
      const [a, b, c] = octets;

      const specialIpv4 =
        a === 0 ||                    // this network / unspecified
        a === 10 ||                   // RFC1918
        a === 127 ||                  // loopback
        a >= 224 ||                   // multicast, reserved, broadcast
        (a === 100 && b >= 64 && b <= 127) || // shared address space / CGNAT
        (a === 169 && b === 254) ||   // link-local / cloud metadata range
        (a === 172 && b >= 16 && b <= 31) || // RFC1918
        (a === 192 && (b === 0 || b === 168)) ||
        (a === 192 && b === 88 && c === 99) ||
        (a === 198 && (b === 18 || b === 19 || b === 51 && c === 100)) ||
        (a === 203 && b === 0 && c === 113);

      if (specialIpv4) return null;
      return parsed;
    }

    // IPv6 literals: accept only global-unicast space (2000::/3), while
    // rejecting mapped IPv4, documentation, tunneling and known special use.
    if (unbracketedHost.includes(":")) {
      const ipv6 = unbracketedHost;
      if (ipv6.startsWith("::ffff:")) return null;
      if (/^2001:db8(?::|$)/.test(ipv6)) return null; // documentation
      if (/^2001:0(?::|$)/.test(ipv6)) return null; // Teredo
      if (/^2002(?::|$)/.test(ipv6)) return null; // 6to4
      if (/^3fff(?::|$)/.test(ipv6)) return null; // documentation
      const firstGroup = Number.parseInt(ipv6.split(":")[0] || "0", 16);
      if (!Number.isInteger(firstGroup) || firstGroup < 0x2000 || firstGroup > 0x3fff) return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

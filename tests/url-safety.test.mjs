import test from "node:test";
import assert from "node:assert/strict";

import { safeHttpUrl } from "../backend/url-safety.ts";

test("accepts ordinary HTTP(S) source URLs", () => {
  assert.equal(safeHttpUrl("https://www.wikipedia.org/wiki/Algeria")?.hostname, "www.wikipedia.org");
  assert.equal(safeHttpUrl("http://neverssl.com/")?.protocol, "http:");
});

test("rejects non-HTTP schemes, credentials and oversized inputs", () => {
  assert.equal(safeHttpUrl("file:///etc/passwd"), null);
  assert.equal(safeHttpUrl("javascript:alert(1)"), null);
  assert.equal(safeHttpUrl("https://user:pass@example.org"), null);
  assert.equal(safeHttpUrl("https://www.wikipedia.org/" + "x".repeat(2100)), null);
});

test("rejects local and special-use hostnames, including trailing-dot variants", () => {
  for (const value of [
    "http://localhost/",
    "http://localhost./",
    "http://api.localhost/",
    "http://router.local/",
    "http://metadata.google.internal/",
    "http://metadata/",
    "http://instance-data.ec2.internal/",
    "http://host.docker.internal/",
    "http://printer.test/",
    "http://host.invalid/",
    "http://site.example/",
  ]) {
    assert.equal(safeHttpUrl(value), null, value);
  }
});

test("rejects private, loopback, link-local and reserved IPv4 ranges", () => {
  for (const value of [
    "http://0.0.0.0/",
    "http://10.0.0.1/",
    "http://100.64.0.1/",
    "http://127.0.0.1/",
    "http://169.254.169.254/latest/meta-data/",
    "http://172.16.0.1/",
    "http://172.31.255.255/",
    "http://192.0.2.1/",
    "http://192.168.1.1/",
    "http://198.18.0.1/",
    "http://198.51.100.1/",
    "http://203.0.113.1/",
    "http://224.0.0.1/",
    "http://255.255.255.255/",
  ]) {
    assert.equal(safeHttpUrl(value), null, value);
  }
});

test("normalizes alternate IPv4 spellings before special-range checks", () => {
  for (const value of [
    "http://2130706433/",
    "http://0x7f000001/",
    "http://0177.0.0.1/",
    "http://0xA9FEA9FE/",
  ]) {
    assert.equal(safeHttpUrl(value), null, value);
  }
});

test("rejects IPv6 loopback, unspecified, mapped, local, link-local and documentation addresses", () => {
  for (const value of [
    "http://[::]/",
    "http://[::1]/",
    "http://[::ffff:127.0.0.1]/",
    "http://[fc00::1]/",
    "http://[fd12:3456::1]/",
    "http://[fe80::1]/",
    "http://[ff02::1]/",
    "http://[2001:db8::1]/",
    "http://[2002:7f00:1::]/",
    "http://[3fff::1]/",
  ]) {
    assert.equal(safeHttpUrl(value), null, value);
  }
});

test("allows an ordinary global-unicast IPv6 source", () => {
  assert.equal(safeHttpUrl("https://[2606:4700:4700::1111]/")?.protocol, "https:");
});

test("documents the boundary: a public-looking DNS hostname can still be rebound", () => {
  // Static parsing cannot resolve/pin DNS or constrain redirects. The research
  // route must not use this function as authorization to invoke a remote fetch.
  assert.equal(safeHttpUrl("https://attacker-controlled.example.org/")?.hostname, "attacker-controlled.example.org");
});

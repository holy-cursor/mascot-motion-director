# Security Policy

## Reporting a vulnerability

Please **do not open a public issue** describing an exploitable security flaw or share a malicious SVG publicly. Instead, use GitHub's private vulnerability reporting via the **Security** tab of this repository, if enabled, or contact the repository owner privately through their public GitHub profile. If private reporting is not available, do not disclose exploit details in a public thread.

Include the affected file and version/commit, a minimal reproducer with no secrets, the observed impact, and a proposed fix if known. Maintainers will assess reports and coordinate disclosure. Response times are not guaranteed.

## Supported versions

Security fixes target the latest release and default branch. Older snapshots are not guaranteed to receive patches.

## Threat model and caution

SVG is an active document format. The script rejects scripts, DOCTYPE/entities, external references, common event handlers, and other unsupported constructs; that is a **defensive filter, not a proof of security**. Treat third-party SVGs as untrusted, review every embedded asset, and use browser sandboxing in sensitive environments. Never disable security checks to make an asset compile.
# Showcase website

This folder contains the **Mascot Motion Director community gallery**. It is a lightweight static website (HTML/CSS/JS) that can run on GitHub Pages without a server.

## Publish with GitHub Pages

1. Open **Settings → Pages** in the repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select `main` and `/docs`, then save.
4. The published URL is normally `https://holy-cursor.github.io/mascot-motion-director/`.

The site is public once GitHub Pages deployment completes. Do not assume a Pages URL is live until checked.

## Add a gallery entry (maintainers)

1. Review the submitted GitHub issue and verify the creator has permission to display the media.
2. Obtain a lightweight, embeddable, HTTPS-hosted MP4/WebM video link. Files committed under `docs/media/` can be referenced with relative paths such as `./media/clip.mp4`.
3. Append one object to `docs/gallery.json` with a unique `id`, `title`, `subtitle`, `category` (`Loader`, `Mascot`, or `Brand`), `creator`, `media`, `poster`, and `description`. Optional fields: `featured`, `link` (public creator URL).
4. Commit the update to `main`; Pages will publish the updated gallery.

The site supports **playable videos**, filters, full-size previews, creator credits, and a user submission form. The submission form opens a *prefilled GitHub issue*, which requires a GitHub account. It does **not** upload videos to GitHub automatically and it does **not** auto-publish community submissions.

For no-login direct video uploads, implement a separate upload service and a moderation queue. Do **not** accept unsanitized community SVG/HTML in the public gallery or expose storage secrets in browser JS.

## Local preview

```bash
python -m http.server 8080 --directory docs
```

Then open `http://localhost:8080`.

## Video recommendations

- H.264 MP4 for broad playback; provide posters for each item.
- Short, muted, looping previews in the cards; full controls in the modal.
- Optimize files and lazy-load most card assets; GitHub Pages is not a video CDN for a large gallery.
- Keep credits and consent attached to each approved submission.

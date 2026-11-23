# Home

A personal home page.

## Favorites

Favorites live in `favorites.json`: a list of groups, each with a `title` and a list of `links`.

```json
{
	"title": "Code",
	"links": [
		{
			"name": "GitHub",
			"url": "https://github.com",
			"description": "Repositories and issues"
		}
	]
}
```

Each link is listed with its description, joined by a dotted leader.

## Artwork

Each load shows a random public-domain painting from [The Metropolitan Museum of Art Collection API](https://metmuseum.github.io/).


The next artwork is fetched in the background and cached, so it shows instantly on the following load.

## Baseline Grid

Text sits on a 24px line height and every block snaps to an 8px grid. Add `#grid` to the URL to overlay the grid.

## Development

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`. Opening `index.html` directly does not work, since browsers block `fetch` on `file://` pages.

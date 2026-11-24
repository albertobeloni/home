# Home

A personal home page.

## Layout

The page splits in two halves. The left half is a solid block in the primary color, holding a short poem. The right half holds the search field and the favorites, centered with 80px around them. On narrow screens, only the right half shows.

The search field follows the desktop bar: a 40px tall field with the search icon in its own square cell.

## Poetry

Each load shows a random short poem from [PoetryDB](https://poetrydb.org), with its title and author. The poem is picked among the ones with 2, 4, 5, 6, 7, 8, or 14 lines (sonnets), keeping its own indentation and stanza breaks. Double hyphens become em dashes. If the request fails, the block stays plain.

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

## Baseline Grid

Text sits on a 24px line height and every block snaps to an 8px grid. Add `#grid` to the URL to overlay the grid.

## Development

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`. Opening `index.html` directly does not work, since browsers block `fetch` on `file://` pages.

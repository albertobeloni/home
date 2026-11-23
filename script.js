const ATTEMPTS = 3;
const COLLECTION = "https://openaccess-api.clevelandart.org/api/artworks/";
const LINE = 24;
const WINDOW = 10000;

const keys = {
	next: "home:artwork",
	total: "home:total",
};

const artwork = document.querySelector(".artwork");
const container = document.querySelector(".groups");

const templates = {
	group: document.querySelector("#group"),
	link: document.querySelector("#link"),
};

const json = async (url) => {
	const response = await fetch(url);

	return response.ok ? response.json() : null;
};

const link = ({ description, name, url }) => {
	const fragment = templates.link.content.cloneNode(true);
	const anchor = fragment.querySelector("a");

	anchor.href = url;
	anchor.querySelector(".name").textContent = name;
	anchor.querySelector(".description").textContent = description ?? "";

	return fragment;
};

const group = ({ links, title }) => {
	const fragment = templates.group.content.cloneNode(true);

	fragment.querySelector("h2").textContent = title;
	fragment.querySelector("ul").append(...links.map(link));

	return fragment;
};

const favorites = async () => {
	const groups = await json("favorites.json").catch(() => null);

	container.append(...(groups ?? []).map(group));
};

const search = async (skip) => {
	const params = new URLSearchParams({
		cc0: 1,
		has_image: 1,
		limit: 1,
		skip,
		type: "Painting",
	});

	return json(`${COLLECTION}?${params}`);
};

const pick = () => {
	const total = Number(localStorage.getItem(keys.total)) || WINDOW;

	return Math.floor(Math.random() * Math.min(total, WINDOW));
};

const random = async () => {
	for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
		const result = await search(pick());

		if (result === null) {
			return null;
		}

		localStorage.setItem(keys.total, result.info.total);

		const [work] = result.data ?? [];

		if (work?.images?.web?.url) {
			return {
				artist: work.creators?.[0]?.description ?? "",
				image: work.images.web.url,
				title: work.title,
				url: work.url,
			};
		}
	}

	return null;
};

const snap = () => {
	const image = artwork.querySelector("img");

	image.style.removeProperty("block-size");
	image.style.removeProperty("inline-size");

	const gap = parseFloat(getComputedStyle(image.parentElement).rowGap);
	const { height, width } = image.getBoundingClientRect();

	image.style.blockSize = `${Math.floor((height + gap) / LINE) * LINE - gap}px`;
	image.style.inlineSize = `${width}px`;
};

const hide = () => {
	artwork.hidden = true;
};

const show = ({ artist, image: source, title, url }) => {
	const image = artwork.querySelector("img");
	const label = artwork.querySelector("figcaption");
	const name = label.querySelector(".title");

	name.href = url;
	name.textContent = title;
	label.querySelector(".artist").textContent = artist;
	image.alt = title;

	image.addEventListener("error", hide);

	image.addEventListener("load", () => {
		artwork.ariaBusy = "false";
		snap();
		new ResizeObserver(snap).observe(document.body);
		requestAnimationFrame(() => artwork.classList.add("loaded"));
	});

	image.src = source;
};

const stored = () => {
	const value = localStorage.getItem(keys.next);

	localStorage.removeItem(keys.next);

	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
};

const prepare = async () => {
	const work = await random();

	if (work) {
		localStorage.setItem(keys.next, JSON.stringify(work));
		new Image().src = work.image;
	}
};

const display = async () => {
	artwork.hidden = false;

	const work = stored() ?? (await random().catch(() => null));

	if (work) {
		show(work);
	} else {
		hide();
	}

	await prepare();
};

const grid = () => {
	document.documentElement.classList.toggle("grid", location.hash === "#grid");
};

addEventListener("hashchange", grid);

addEventListener("pageshow", (event) => {
	const [entry] = performance.getEntriesByType("navigation");

	if (event.persisted || entry.type === "back_forward") {
		location.reload();
	}
});

grid();
favorites();

if (matchMedia("(width >= 960px) and (height >= 480px)").matches) {
	display().catch(() => null);
}

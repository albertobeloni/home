const LENGTHS = [2, 4, 5, 6, 7, 8, 14];
const POETRY = "https://poetrydb.org";

const container = document.querySelector(".groups");
const poem = document.querySelector(".poem");

const templates = {
	group: document.querySelector("#group"),
	link: document.querySelector("#link"),
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
	const groups = await fetch("favorites.json")
		.then((response) => (response.ok ? response.json() : []))
		.catch(() => []);

	container.append(...groups.map(group));
};

const verse = async () => {
	const length = LENGTHS[Math.floor(Math.random() * LENGTHS.length)];
	const poems = await fetch(`${POETRY}/random,linecount/1;${length}/title,author,lines`)
		.then((response) => (response.ok ? response.json() : []))
		.catch(() => []);
	const [piece] = Array.isArray(poems) ? poems : [];

	if (!piece?.lines) {
		return;
	}

	poem.querySelector("blockquote").append(
		...piece.lines.map((line) => {
			const element = document.createElement("span");

			element.textContent = line.replaceAll("--", "—");

			return element;
		}),
	);
	poem.querySelector("cite").textContent = piece.title;
	poem.querySelector(".author").textContent = piece.author;
	poem.hidden = false;
	requestAnimationFrame(() => poem.classList.add("loaded"));
};

const grid = () => {
	document.documentElement.classList.toggle("grid", location.hash === "#grid");
};

addEventListener("hashchange", grid);

grid();
favorites();

if (matchMedia("(width >= 960px)").matches) {
	verse();
}

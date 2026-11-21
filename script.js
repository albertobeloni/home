const container = document.querySelector(".groups");

const templates = {
	group: document.querySelector("#group"),
	link: document.querySelector("#link"),
};

const group = ({ links, title }) => {
	const fragment = templates.group.content.cloneNode(true);

	fragment.querySelector("h2").textContent = title;
	fragment.querySelector("ul").append(...links.map(link));

	return fragment;
};

const link = ({ description, name, url }) => {
	const fragment = templates.link.content.cloneNode(true);
	const anchor = fragment.querySelector("a");

	anchor.href = url;
	anchor.querySelector(".name").textContent = name;
	anchor.querySelector(".description").textContent = description;

	return fragment;
};

addEventListener("pageshow", (event) => {
	if (event.persisted) {
		location.reload();
	}
});

const response = await fetch("favorites.json");

if (response.ok) {
	const groups = await response.json();

	container.append(...groups.map(group));
}

const fs = require("fs").promises;
const path = require("path");

async function createTree(count, folderPath) {
	await fs.mkdir(folderPath, { recursive: true });
	await generateModules("index", 2, 0, folderPath, count);
}

async function generateModules(prefix, count, depth, folderPath, remaining) {
	if (remaining <= 0) return;
	let list = [];

	for (let i = 0; i < count && remaining > 0; i++, remaining--) {
		const modulePath = path.join(folderPath, `${prefix}-${i}.js`);
		list.push(generateModuleCode(i, prefix, depth));

		if (depth < 5) {
			await generateModules(`${prefix}-${i}`, count + depth + Math.pow(i, 2), depth + 1, folderPath, remaining);
		}
		await fs.writeFile(modulePath, `let counter = 0;\n${list.join("\n")};\nexport default counter;\n${avgJs}`);
	}
}

function generateModuleCode(index, prefix, depth) {
	const importStatement = depth <= 4 && index >= 3 && index <= 4
		? `const module${index} = import("./${prefix}-${index}");`
		: `import module${index} from "./${prefix}-${index}";`;

	return `${importStatement}\ncounter += module${index};`;
}

// Initialization
(async () => {
	const root = __dirname;
	await createTree(100, path.join(root, "modules-100"));
	await createTree(500, path.join(root, "modules-500"));
	await createTree(1000, path.join(root, "modules-1000"));
	await createTree(3000, path.join(root, "modules-3000"));
	await createTree(5000, path.join(root, "modules-5000"));
})();

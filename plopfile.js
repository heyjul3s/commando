import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const featuresRoot = path.join(projectRoot, 'src/features');

function titleCase(value) {
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function findComponents() {
  const components = [];

  if (!existsSync(featuresRoot)) {
    return components;
  }

  for (const feature of readdirSync(featuresRoot, { withFileTypes: true })) {
    const componentsRoot = path.join(featuresRoot, feature.name, 'components');
    if (!feature.isDirectory() || !existsSync(componentsRoot)) {
      continue;
    }

    for (const component of readdirSync(componentsRoot, { withFileTypes: true })) {
      const componentFile = path.join(componentsRoot, component.name, `${component.name}.tsx`);
      if (!component.isDirectory() || !existsSync(componentFile)) {
        continue;
      }

      const source = readFileSync(componentFile, 'utf8');
      const exportedName = source.match(/export\s+(?:function|const)\s+([A-Z]\w*)/)?.[1];
      if (!exportedName) {
        continue;
      }

      components.push({
        directory: path
          .relative(projectRoot, path.dirname(componentFile))
          .split(path.sep)
          .join('/'),
        name: component.name,
        exportedName,
        title: `Features/${titleCase(feature.name)}/${titleCase(component.name)}`,
      });
    }
  }

  return components.sort((left, right) => left.directory.localeCompare(right.directory));
}

export default function configurePlop(plop) {
  const components = findComponents();
  const findComponent = (directory) =>
    components.find((component) => component.directory === directory);

  plop.setGenerator('stories', {
    description: 'Add colocated Storybook states, fixtures, optional interactions, and MDX',
    prompts: [
      {
        type: 'list',
        name: 'component',
        message: 'Which component needs stories?',
        choices: components.map((component) => ({
          name: component.directory,
          value: component.directory,
        })),
      },
      {
        type: 'input',
        name: 'title',
        message: 'Storybook sidebar title:',
        default: (answers) => findComponent(answers.component)?.title,
        filter: (value) => value.trim(),
        validate: (value) => Boolean(value.trim()) || 'Enter a sidebar title.',
      },
      {
        type: 'confirm',
        name: 'interactions',
        message: 'Include interaction stories and named play functions?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'docs',
        message: 'Include a standalone MDX overview?',
        default: true,
      },
    ],
    actions(answers) {
      const component = findComponent(answers.component);
      if (!component) {
        throw new Error('Choose an existing feature component with a named export.');
      }
      const title = answers.title?.trim();
      if (!title || /[\r\n]/.test(title)) {
        throw new Error('The sidebar title must be a non-empty single line.');
      }

      const data = {
        name: component.name,
        componentName: component.exportedName,
        // JSON literals also safely handle quotes in custom sidebar titles.
        statesTitle: JSON.stringify(`${title}/States`),
        interactionsTitle: JSON.stringify(`${title}/Interactions`),
        docsTitle: `${title}/Overview`,
      };
      const templates = [
        ['stories.tsx', 'stories.tsx.hbs'],
        ['fixtures.ts', 'fixtures.ts.hbs'],
      ];
      if (answers.interactions) {
        templates.push(['interactions.stories.tsx', 'interactions.stories.tsx.hbs']);
        templates.push(['interactions.ts', 'interactions.ts.hbs']);
      }
      if (answers.docs) {
        templates.push(['mdx', 'docs.mdx.hbs']);
      }

      const files = templates.map(([suffix, template]) => ({
        destination: `${component.directory}/stories/${component.name}.${suffix}`,
        template,
        parser: suffix === 'mdx' ? 'mdx' : 'typescript',
      }));

      return [
        function checkDestinations() {
          const collisions = files.filter((file) =>
            existsSync(path.join(plop.getDestBasePath(), file.destination)),
          );
          if (collisions.length > 0) {
            throw new Error(
              `No files written. These files already exist:\n${collisions.map((file) => file.destination).join('\n')}`,
            );
          }
          return 'All destination files are available.';
        },
        ...files.map((file) => ({
          type: 'add',
          path: file.destination,
          templateFile: path.join(projectRoot, 'plop-templates/stories', file.template),
          data,
          force: false,
          abortOnFail: true,
          async transform(content) {
            const options = await resolveConfig(path.join(projectRoot, 'prettier.config.ts'));
            return format(content, { ...options, parser: file.parser });
          },
        })),
      ];
    },
  });
}

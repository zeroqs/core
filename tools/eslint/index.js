import antfu from '@antfu/eslint-config';
import { fixupPluginRules } from '@eslint/compat';
import pluginNext from '@next/eslint-plugin-next';
import * as effectorRule from 'eslint-plugin-effector';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';

/** @type {import('@zeroqs/eslint').Eslint} */
export const eslint = (
  { jsxA11y = false, next = false, effector = false, ...options },
  ...configs
) => {
  const stylistic = options.stylistic ?? false;

  if (effector) {
    configs.unshift({
      plugins: {
        effector: fixupPluginRules(effectorRule)
      },
      name: 'effector',
      rules: effectorRule.default.configs.recommended.rules
    });
  }

  if (next) {
    configs.unshift({
      plugins: {
        'zeroqs-next': pluginNext
      },
      name: 'zeroqs/next',
      rules: {
        ...Object.entries({ ...pluginNext.configs.recommended.rules }).reduce(
          (acc, [key, value]) => {
            acc[key.replace('@next/next', 'zeroqs-next')] = value;
            return acc;
          },
          {}
        )
      }
    });
  }

  if (jsxA11y) {
    configs.unshift({
      plugins: {
        'zeroqs-jsx-a11y': pluginJsxA11y
      },
      name: 'zeroqs/jsx-a11y',
      rules: {
        ...Object.entries(pluginJsxA11y.flatConfigs.recommended.rules).reduce(
          (acc, [key, value]) => {
            acc[key.replace('jsx-a11y', 'zeroqs-jsx-a11y')] = value;
            return acc;
          },
          {}
        )
      }
    });
  }

  if (options.react) {
    configs.unshift({
      name: 'zeroqs/react',
      plugins: {
        'zeroqs-react': pluginReact
      },
      settings: {
        react: {
          version: 'detect'
        }
      },
      rules: {
        ...Object.entries(pluginReact.configs.recommended.rules).reduce((acc, [key, value]) => {
          acc[key.replace('react', 'zeroqs-react')] = value;
          return acc;
        }, {}),
        'zeroqs-react/react-in-jsx-scope': 'off',
        'zeroqs-react/function-component-definition': [
          'error',
          {
            namedComponents: ['arrow-function'],
            unnamedComponents: 'arrow-function'
          }
        ]
      }
    });
  }

  if (stylistic) {
    configs.unshift({
      name: 'zeroqs/formatter',
      rules: {
        'style/multiline-ternary': 'off',
        'style/jsx-curly-newline': 'off',
        'style/jsx-one-expression-per-line': 'off',
        'style/member-delimiter-style': 'off',
        'style/quote-props': 'off',
        'style/operator-linebreak': 'off',
        'style/brace-style': 'off',

        'style/max-len': [
          'error',
          100,
          2,
          { ignoreComments: true, ignoreStrings: true, ignoreTemplateLiterals: true }
        ],
        'style/quotes': ['error', 'single', { allowTemplateLiterals: true }],
        'style/jsx-quotes': ['error', 'prefer-single'],
        'style/comma-dangle': ['error', 'never'],
        'style/semi': ['error', 'always'],
        'style/indent': ['error', 2, { SwitchCase: 1 }],
        'style/no-tabs': 'error',
        'style/linebreak-style': ['error', 'unix'],
        'style/arrow-parens': ['error', 'always']
      }
    });
  }

  return antfu(
    { ...options, stylistic },
    {
      name: 'zeroqs/rewrite',
      rules: {
        'antfu/curly': 'off',
        'antfu/if-newline': 'off',
        'antfu/top-level-function': 'off',

        'no-console': 'warn',

        'react-hooks/exhaustive-deps': 'off',

        'test/prefer-lowercase-title': 'off'
      }
    },
    {
      name: 'zeroqs/imports',
      rules: {
        'perfectionist/sort-array-includes': [
          'error',
          {
            order: 'asc',
            type: 'alphabetical'
          }
        ],
        'perfectionist/sort-imports': [
          'error',
          {
            groups: [
              'type',
              ['builtin', 'external'],
              'internal-type',
              ['internal'],
              ['parent-type', 'sibling-type', 'index-type'],
              ['parent', 'sibling', 'index'],
              'object',
              'style',
              'side-effect-style',
              'unknown'
            ],
            internalPattern: ['^~/.*', '^@/.*'],
            newlinesBetween: 'always',
            order: 'asc',
            type: 'natural'
          }
        ],
        'perfectionist/sort-interfaces': [
          'error',
          {
            groups: ['unknown', 'method', 'multiline'],
            order: 'asc',
            type: 'alphabetical'
          }
        ],
        'perfectionist/sort-jsx-props': [
          'error',
          {
            customGroups: {
              callback: 'on*',
              reserved: ['key', 'ref']
            },
            groups: ['shorthand', 'reserved', 'multiline', 'unknown', 'callback'],
            order: 'asc',
            type: 'alphabetical'
          }
        ],
        'perfectionist/sort-union-types': [
          'error',
          {
            groups: [
              'conditional',
              'function',
              'import',
              'intersection',
              'keyword',
              'literal',
              'named',
              'object',
              'operator',
              'tuple',
              'union',
              'nullish'
            ],
            order: 'asc',
            specialCharacters: 'keep',
            type: 'alphabetical'
          }
        ]
      }
    },
    ...configs
  );
};

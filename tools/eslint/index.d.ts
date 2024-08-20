declare module '@zeroqs/eslint' {
    declare type Eslint = (
        options?: import('@antfu/eslint-config').OptionsConfig & {
            jsxA11y?: boolean;
            next?: boolean;
            effector?: boolean;
        } & import('@antfu/eslint-config').TypedFlatConfigItem,
        ...userConfigs: import('@antfu/eslint-config').Awaitable<
            | import('@antfu/eslint-config').TypedFlatConfigItem
            | import('@antfu/eslint-config').TypedFlatConfigItem[]
            | import('@antfu/eslint-config').FlatConfigComposer<any, any>
            | Linter.Config[]
        >[]
    ) => import('@antfu/eslint-config').FlatConfigComposer<
        import('@antfu/eslint-config').TypedFlatConfigItem,
        import('@antfu/eslint-config').ConfigNames
    >;

    export const eslint: Eslint;
}
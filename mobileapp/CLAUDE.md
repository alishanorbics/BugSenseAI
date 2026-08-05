# CLAUDE.md

## Who this is for
Personal default React Native conventions. Applies when scaffolding a new mobile app from scratch on React Native CLI: functional components, Redux Toolkit + RTK Query, Formik/Yup, React Navigation, plain `StyleSheet`, plain JavaScript (no TypeScript). Deviate only if the project already has an established different convention.

## Folder Structure

```
src/
  App.jsx
  assets/
    fonts/
      index.js        # family -> weight map via Platform.select
    images/
      index.js        # key -> require(...) map
  components/
    Button/index.jsx
    Text/index.jsx
    Input/index.jsx
    Touchable/index.jsx
    Row/index.jsx
    FlatList/index.jsx
    Loader/index.jsx
    Icon/index.jsx
    ...
  config/
    env.js
  contexts/
    ModalContext/index.jsx
  helpers/
    colors.js
    metrics.js
    routes.js
    navigation.js
    general.js
    data.js
  hooks/
    useToggle.js
    useSearch.js
    usePagination.js
    ...
  layouts/
    PrimaryLayout/index.jsx
    AuthLayout/index.jsx
  navigation/
    AppStackNavigator/index.jsx
    AuthStackNavigator/index.jsx
    AppDrawerNavigator/index.jsx
    BottomNavigator/index.jsx
    MainStackNavigator/index.jsx
  redux/
    apis/
      Base/index.js
      Auth/index.js
      <Feature>/index.js
    middlewares/
      error.middleware.js
    selectors/
      index.js
    slices/
      auth.slice.js
      general.slice.js
    store/
      index.js
  screens/
    Home/
      index.jsx
      useHomeController.js
    Auth/
      Login/
        index.jsx
        useLoginController.js
```

No `tsconfig.json`, no `@types/*` packages, no `.ts`/`.tsx` files — plain `.js`/`.jsx` throughout, deliberately (see Coding Patterns).

## Coding Patterns

**Naming**
- PascalCase folder + `index.jsx` for every screen and component — never `ComponentName.jsx` as a bare file, never a `Screen` suffix on screen names.
- Controller hook: `use<ScreenName>Controller.js`, colocated next to the screen's `index.jsx`.
- Local variables, object keys, and style/prop keys: `snake_case` (`user_name`, `is_editing`, `left_icon`). Functions, handlers, hooks, and components stay `camelCase`/`PascalCase` (`onPress`, `toggleModal`, `useHomeController`).
- Redux slice files: `<name>.slice.js`. Middleware files: `<name>.middleware.js`.

**Language**
- Plain JavaScript only. Do not scaffold with RN CLI's TypeScript template — no `tsconfig.json`, no `@types/*` packages, no `.ts`/`.tsx` files.
- Never type props — no PropTypes, no TS interfaces/types. Destructure with inline defaults instead.
- No `RootStackParamList`, no generic `useNavigation<>()` — navigation and props stay untyped everywhere.

**Component structure**
- Function components only, arrow syntax, default export.
- Destructure props directly in the function signature with inline defaults.
- Wrap atomic/leaf reusable components (`Button`, `Text`, `Icon`, `Touchable`, `Input`, `Checkbox`) in `memo()`. Don't bother memoizing screens, layouts, or composite/container components (`Row`, modals, the `FlatList` wrapper) — they re-render with their children anyway.
- Screens are pure view layers: no `useState`/`useSelector`/RTK Query hooks inside `index.jsx`. Call `const { values, functions } = use<Screen>Controller()` and render off that object only.

**Styling**
- `StyleSheet.create` only. No inline style objects except tiny one-off transforms. No styled-components/tailwind.
- Centralize tokens in `helpers/colors.js` (flat colors object) and `helpers/metrics.js` (`heightPixel`/`widthPixel`/`font` scaling against a fixed design frame, e.g. 430×932). Use these instead of hardcoded colors/numbers everywhere.
- Fonts centralized in `assets/fonts/index.js` via `Platform.select`, consumed only inside the `Text` wrapper.
- Declare `StyleSheet.create` after the component definition/export.

**State management**
- Keep slices minimal — two usually cover it: `auth.slice.js` (user, token, `is_authenticated`) and `general.slice.js` (app config, `first_launch`). Everything else lives in RTK Query's cache.
- Populate slice state from API responses via `extraReducers.addMatcher(api.endpoints.x.matchFulfilled, ...)`, not by dispatching plain actions manually after a request succeeds.
- Centralize selectors in one `redux/selectors/index.js` barrel as plain `select<X> = (state) => state.slice.field` functions. Always consume via `useSelector(selectX)`.
- `redux-persist`: persist only the plain slices via an explicit `whitelist` (`["auth", "general"]`), never a blacklist. Exclude RTK Query API reducers from persistence.
- `useState` for local/ephemeral UI state (toggles, timers, modal visibility). `useSelector`/RTK Query for anything global or server-derived. Never duplicate server state into local state.

**API layer (RTK Query)**
- One file per feature under `redux/apis/<Feature>/index.js`, injecting onto a single shared `baseApi` via `injectEndpoints` — not one monolithic API file.
- Define `baseApi` once (`redux/apis/Base/index.js`) with an empty endpoints object, one `reducerPath`, and `prepareHeaders` attaching the bearer token from state.
- Use `providesTags`/`invalidatesTags` on every query/mutation; declare the tag list once on `baseApi`.
- Unwrap the endpoint payload inline at each call site (`result.data?.data`) rather than centralizing with `transformResponse`. Apply this consistently everywhere you consume a hook's result.
- Handle request failures in one place: a single Redux middleware listening for `isRejectedWithValue`, reading the message off the action payload, and showing a global Toast. No per-screen try/catch or per-screen error branching.

**Navigation**
- React Navigation v7. One file per navigator under `navigation/<Name>Navigator/index.jsx`, each calling `createXNavigator()` once at module scope.
- Use `createStackNavigator` from `@react-navigation/stack`, not `native-stack`.
- Centralize every route name and per-route screen options in `helpers/routes.js` as a `ROUTES` object (+ a parallel options map). Never inline route-name strings in a navigator.
- **Trigger navigation only through the ref-based helper module** (`helpers/navigation.js`) exporting `navigate`/`goBack`/`replace`/`push`/`reset`, wrapping a module-level nav ref and guarding every call with `isReady()`. Call these from controllers. Never call `useNavigation()` inside a controller to trigger navigation — see Situational Patterns for the one allowed exception.
- Use `useRoute()` only to read incoming params (`const { x } = route.params || {}`), never to trigger navigation. Pass params as a plain object second argument to `navigate()`.

**Wrapper components**
- Never import `Text`, `TouchableOpacity`, or `TextInput` directly from `react-native` inside a screen or feature component — use the project's `Text`, `Touchable`, and `Input` wrappers. Raw RN versions of these three belong only inside the wrapper components themselves.
- `View` is fine to use directly everywhere — don't wrap it.
- Build out a base component set as needed: `Button`, `Text`, `Input`, `Row`, `Touchable`, `Checkbox`, `Icon`, `FlatList` (with built-in loading/empty support), `Loader`, `Avatar`/`AvatarGroup`, `ProgressBar`, `GlobalModal`, `BottomSheetModal`, `ImagePickerModal`, `KeyboardAvoidingWrapper`.

**Hooks**
- Keep custom hooks flat under `hooks/`, one hook per file, default-exported, named `useX.js`.
- Every custom hook returns a plain object (e.g. `{ value, toggle, set }`), never an array tuple — mirrors the `{ values, functions }` shape controllers return.
- `useCallback` is fine for handlers passed to lists/children; there's no hard rule forcing it everywhere.
- Avoid `useMemo`. Compute derived values inline on every render instead of memoizing them.

**Error & loading state**
- No shared `ErrorView`/`ErrorBoundary` and no per-screen `isError` checks — RTK Query failures are caught globally by the error-toast middleware. Only read `isError` locally when you need to react to failure in the UI itself (e.g. rolling back an optimistic update).
- Content/query loading: ternary-render a shared `Loader` against the controller's `isLoading` flag (`values.isLoading ? <Loader /> : <Content />`).
- Submit/mutation loading: pipe `isLoading` straight into the triggering `Button`'s `loading` prop instead of a ternary.
- Lists: use the shared `FlatList` wrapper's `loading` and `empty` props rather than handling either state in the screen.

**Forms**
- Formik + Yup, exclusively — no react-hook-form, no zod, no hand-rolled validation.
- Define the Yup schema as a module-level constant named `<screen>_schema`, above the controller.
- Call `useFormik({ initialValues, validationSchema, onSubmit })` inside the controller, never in the screen view.
- Return the whole `formik` object to the view as `values.formik`; bind fields via `formik.values`, `formik.errors`, `formik.touched`, `formik.handleChange`, `formik.handleSubmit`.
- Screens with only toggles/selectors and no free-text input skip Formik and use plain `useState`.

**Assets**
- One central barrel per asset type: `assets/images/index.js` maps short keys to `require(...)` calls; `assets/fonts/index.js` maps family → weight via `Platform.select`.
- Always import the default barrel object and reference by key (`images.logo`) — never call `require()` directly outside these two files.
- Apply font families only inside the `Text` wrapper.
- `assets/images/index.js` maps only true images — logos, illustrations, photos, onboarding graphics. Icons never go through this barrel; they're rendered via the `Icon` wrapper component instead.

**Icons**
- `react-native-vector-icons`, using the `lucide` set exclusively (`import Icon from 'react-native-vector-icons/lucide'`) — no mixing icon sets (no FontAwesome, MaterialIcons, Ionicons, etc. alongside it).
- Route every icon through a dedicated `Icon` wrapper component (`components/Icon/index.jsx`), never import from `react-native-vector-icons/lucide` directly in a screen or feature component.
- The `Icon` wrapper takes a `name` prop (the Lucide icon name string), plus `size`/`color` props with sane defaults pulled from `helpers/colors.js`/`helpers/metrics.js`.
- Requires font linking as part of project setup: register the Lucide font file per `react-native-vector-icons`' standard native setup (iOS `Info.plist` UIAppFonts entry + `react-native.config.js` asset linking, or autolinking depending on RN version). This is a one-time setup step — see "Scaffolding a new project" — not something to repeat per-icon-usage.
- Never place icon assets (SVGs, PNGs used as icons, etc.) inside `assets/images/`. That folder is reserved for actual images only. Icons are sourced exclusively from `react-native-vector-icons/lucide` via the `Icon` wrapper, not from local asset files — there should be no icon files anywhere in `assets/` at all.

**Theming**
- All colors and typography must be centralized in `helpers/colors.js` and `assets/fonts/`. Never hardcode a hex value or font name directly in a component's StyleSheet.
- Actual color palette, font family, and dark mode support are project-specific — defined in `mobile-app-findings/DESIGN.md`, not inherited from this file. Read DESIGN.md at project kickoff and populate colors.js/assets/fonts/ accordingly.

## How to Write New Code

**Scaffolding a new project**
1. Initialize the RN project without the TypeScript template — plain `.js`/`.jsx` from the start.
2. Set up the folder structure above (`assets/`, `components/`, `redux/`, `screens/`, etc.).
3. Install and configure `react-native-vector-icons` with the `lucide` set; complete the one-time native font-linking setup (iOS `Info.plist` UIAppFonts entry + asset linking/autolinking).
4. Read `mobile-app-findings/DESIGN.md` and populate `helpers/colors.js` and `assets/fonts/` with the project's actual palette and font family before building the base wrapper component set.
5. Build the base wrapper component set (`Button`, `Text`, `Input`, `Touchable`, `Row`, `Icon`, `FlatList`, `Loader`) before building screens.
6. Set up `redux/store`, `baseApi`, `auth.slice.js`, `general.slice.js`, and `redux-persist` with the `whitelist` config.
7. Set up navigation: navigator files under `navigation/`, `ROUTES` in `helpers/routes.js`, and the ref-based `helpers/navigation.js` helper.

**Adding a new screen**
1. Create `src/screens/<ScreenName>/index.jsx` (pure view) and, if it needs state/logic, `use<ScreenName>Controller.js` returning `{ values, functions }`.
2. Add the route name to `ROUTES` in `helpers/routes.js` (plus header options if needed).
3. Register the screen in the relevant navigator under `navigation/`.
4. If it calls the backend, add or reuse RTK Query endpoints instead of fetching manually.
5. Build the view with wrapper components (`Text`, `Touchable`, `Input`, `Button`, `Row`, `FlatList`) — never raw RN `Text`/`TouchableOpacity`/`TextInput`.
6. Style with `StyleSheet.create`, pulling from `helpers/colors.js` and `helpers/metrics.js`.
7. Wire loading/error states per the Error & Loading pattern — no per-screen try/catch.

**Adding a new API feature**
1. Create `redux/apis/<Feature>/index.js`, injecting onto the shared `baseApi` via `injectEndpoints`.
2. Add `providesTags`/`invalidatesTags` for anything cached.
3. Unwrap the payload at the call site (`data?.data`) — don't add a `transformResponse`.
4. If the result needs to persist as global state, sync it into a slice via `extraReducers.addMatcher(api.endpoints.x.matchFulfilled, ...)` rather than dispatching manually.
5. Decide if this mutation needs an explicit success modal, or if the UI update itself is enough (see Situational Patterns).

**Adding a new reusable component**
1. Create `components/<ComponentName>/index.jsx`.
2. Destructure props inline with defaults; no PropTypes/TS types.
3. Wrap in `memo()` if it's an atomic/leaf primitive (skip for layouts/composites).
4. Style via `StyleSheet.create`, tokens from `colors.js`/`metrics.js`.

## Situational Patterns

- **`useNavigation()` exception**: allowed directly inside a screen's `index.jsx` for read-only concerns (e.g. `useIsFocused()`), but never to trigger navigation. Triggering navigation always goes through the ref-based helper, regardless of whether it's called from a controller or a screen.
- **Success modal after a mutation**: use `useEffect(() => { if (isSuccess) showModal() }, [isSuccess])` only for high-stakes mutations where the UI doesn't already visibly confirm the action — payments, submissions after which the user navigates away, irreversible actions (delete, account changes). Skip it for mutations where the screen's own UI update is sufficient feedback (toggles, favorites/likes, inline edits).
- `memo()`: apply to atomic/leaf reusable components (`Button`, `Text`, `Icon`, `Touchable`, `Input`); skip for screens, layouts, and composite/container components — they re-render with their children regardless.
- Loading UI depends on trigger: ternary + shared `Loader` for content/query loading, `Button`'s `loading` prop for submit-triggered mutations, `FlatList`'s own `loading`/`empty` props for lists.
- Formik/Yup only for screens with real free-text fields; toggle/selector-only "forms" use plain `useState`.
- Auth endpoints (login/signup/forgot-password) get a standalone `createApi` instead of injecting into the shared `baseApi`, since they must run before a token exists and can't share its `prepareHeaders`.
- Keep `assets/images` flat by default; once the set grows large, group into feature subfolders (e.g. `drawer/`, `platforms/`) while keeping the single central index barrel.

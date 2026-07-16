import { useMemo } from "react";

export default function useNavItems({ descriptors, state }) {
  return useMemo(
    () =>
      state.routes
        .map((route) => {
          const options = descriptors[route.key]?.options;
          if (options?.href === null) return null;
          const label =
            typeof options?.tabBarLabel === "string"
              ? options.tabBarLabel
              : (options?.title ?? route.name);

          return {
            icon: (focused, color, size) =>
              options?.tabBarIcon?.({ focused, color, size }) ?? null,
            key: route.key,
            label,
            route,
            routeName: route.name,
          };
        })
        .filter((item) => item !== null),
    [descriptors, state.routes],
  );
}

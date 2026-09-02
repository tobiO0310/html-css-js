import AutoButton from "@/app/buttons/AutoButton";
import ManualButton from "./buttons/ManualButton";
import { useEffect, useReducer } from "react";

export const AvailableManualUpgrades = {
    plus1: [10, 1, 0, "~Plus 1 Click~"],
    plus5: [40, 5, 0, "~Plus 5 Click~"],
    plus10: [75, 10, 0, "~Plus 10 Click~"],
    plus100: [600, 100, 0, "~Plus 100 Click~"],
    plus500: [1000, 500, 0, "~Plus 500 Click~"],
} as const;

export const AvailableAutoUpgrades = {
    enable: [5, 1, 10_000, "~Enable Autoclicker~"],
    plus1: [100, 1, 0, "~Plus 1 Auto~"],
    plus5: [400, 5, 0, "~Plus 5 Auto~"],
    plus10: [750, 100, 0, "~Plus 10 Auto~"],
    faster100: [1500, 0, -100, "~ -100ms Auto~"],
} as const;

export const MaxUpgrades: {
    [k in
        | keyof typeof AvailableManualUpgrades
        | keyof typeof AvailableAutoUpgrades]?: number;
} = {
    enable: 1,
    faster100: 10_000 / 100
};

export type Info<K, P> = {
    amount: number;
    timeout: number;
    upgrades: P extends true
        ? {
              -readonly [k in keyof K]?: number;
          }
        : {
              -readonly [k in keyof K]: number;
          };
};
export type ManualInfo<P = false> = Info<typeof AvailableManualUpgrades, P>;
export type AutoInfo<P = false> = Info<typeof AvailableAutoUpgrades, P>;

function moneyReducer(state: number, amount: number): number {
    return state + amount;
}

function upgradeReducer<K, P>(
    state: Info<K, P>,
    change: Partial<Info<K, true>>,
): Info<K, P> {
    const upgrades: Info<K, true>["upgrades"] = { ...state.upgrades };
    for (const badKey in change.upgrades) {
        if (!Object.hasOwn(change.upgrades, badKey)) continue;

        const key = badKey as keyof K;
        upgrades[key] = (upgrades[key] ?? 0) + (change.upgrades[key] ?? 0);
    }

    return {
        amount: state.amount + (change.amount ?? 0),
        timeout: state.timeout + (change.timeout ?? 0),
        upgrades: upgrades as Info<K, P>["upgrades"],
    };
}

export default function usePlayerState() {
    const [money, updateMoney] = useReducer(moneyReducer, 0);
    const [manual, updateManual] = useReducer<
        ManualInfo,
        [Partial<ManualInfo<true>>]
    >(
        upgradeReducer,
        (() => {
            const upgrades: Partial<ManualInfo["upgrades"]> = {};
            for (const key in AvailableManualUpgrades) {
                upgrades[key as keyof typeof AvailableManualUpgrades] = 0;
            }
            return {
                amount: 1,
                timeout: 1_000,
                upgrades: upgrades as ManualInfo["upgrades"],
            };
        })(),
    );
    const [auto, updateAuto] = useReducer<AutoInfo, [Partial<AutoInfo<true>>]>(
        upgradeReducer,
        (() => {
            const upgrades: Partial<AutoInfo["upgrades"]> = {};
            for (const key in AvailableAutoUpgrades) {
                upgrades[key as keyof typeof AvailableAutoUpgrades] = 0;
            }
            return {
                amount: 0,
                timeout: 0,
                upgrades: upgrades as AutoInfo["upgrades"],
            };
        })(),
    );

    useEffect(() => {
        if (auto.timeout === 0) return;

        const id = setInterval(() => {
            updateMoney(auto.amount);
        }, auto.timeout);

        return () => clearInterval(id);
    }, [auto]);

    const manualClick = (b: HTMLButtonElement) => {
        b.disabled = true;

        updateMoney(manual.amount);

        setTimeout(() => (b.disabled = false), manual.timeout);
    };

    const manualUpgrade = (upgrade: keyof typeof AvailableManualUpgrades) => {
        return () => {
            if (money < AvailableManualUpgrades[upgrade][0]) return;

            updateMoney(-AvailableManualUpgrades[upgrade][0]);

            console.log(manual);
            updateManual({
                amount: AvailableManualUpgrades[upgrade][1],
                timeout: AvailableManualUpgrades[upgrade][2],
                upgrades: {
                    [upgrade]: 1,
                },
            });
            console.log(manual);
        };
    };

    const manualUpgrades = [];
    for (const key in AvailableManualUpgrades) {
        if (!Object.hasOwn(AvailableManualUpgrades, key)) continue;
        const element =
            AvailableManualUpgrades[
                key as keyof typeof AvailableManualUpgrades
            ];
        const upgradeAmount =
            manual.upgrades[key as keyof typeof AvailableManualUpgrades];
        if (
            (upgradeAmount == 0 && money < element[0]) ||
            (MaxUpgrades[key as keyof typeof AvailableManualUpgrades] ??
                Infinity) <= upgradeAmount
        )
            continue;

        manualUpgrades.push(
            <ManualButton
                key={key}
                name={element[3]}
                disabled={money < element[0]}
                onClick={manualUpgrade(
                    key as keyof typeof AvailableManualUpgrades,
                )}
            />,
        );
    }

    const autoUpgrade = (upgrade: keyof typeof AvailableAutoUpgrades) => {
        return () => {
            if (money < AvailableAutoUpgrades[upgrade][0]) return;

            updateMoney(-AvailableAutoUpgrades[upgrade][0]);

            updateAuto({
                amount: AvailableAutoUpgrades[upgrade][1],
                timeout: AvailableAutoUpgrades[upgrade][2],
                upgrades: {
                    [upgrade]: 1,
                },
            });
        };
    };

    const autoUpgrades = [];
    for (const key in AvailableAutoUpgrades) {
        if (!Object.hasOwn(AvailableAutoUpgrades, key)) continue;
        const element =
            AvailableAutoUpgrades[key as keyof typeof AvailableAutoUpgrades];
        const upgradeAmount =
            auto.upgrades[key as keyof typeof AvailableAutoUpgrades];
        if (
            (upgradeAmount == 0 && money < element[0]) ||
            (MaxUpgrades[key as keyof typeof AvailableAutoUpgrades] ??
                Infinity) <= upgradeAmount
        )
            continue;

        autoUpgrades.push(
            <AutoButton
                key={key}
                name={element[3]}
                disabled={money < element[0]}
                onClick={autoUpgrade(key as keyof typeof AvailableAutoUpgrades)}
            />,
        );
    }

    return [money, manualClick, manualUpgrades, autoUpgrades] as const;
}

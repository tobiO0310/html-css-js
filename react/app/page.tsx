"use client";

import usePlayerState from "./usePlayerState";
import { useRef } from "react";

export default function Home() {
    const manualButton = useRef<HTMLButtonElement>(null);
    const [money, manualClick, manualUpgrades, autoUpgrades] = usePlayerState();

    return (
        <div className="flex flex-col flex-1 items-center justify-center">
            <main className="flex flex-1">
                <div
                    className="hero min-h-screen min-w-screen"
                    style={{
                        backgroundImage:
                            "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
                    }}
                >
                    <div className="hero-overlay"></div>
                    <div className="hero-content text-neutral-content text-center">
                        <div className="max-w-lg glass min-w-lg rounded-3xl p-1">
                            <h1 className="mb-1 text-5xl font-bold">
                                Hello there
                            </h1>
                            <p className="mb-1">
                                I hope you&apos;re doing amazing!~
                                <br />
                                <br />
                                You&apos;re currently at {money.toLocaleString()}!
                            </p>
                            <button
                                className="btn btn-primary mb-1"
                                onClick={(e) =>
                                    manualClick(e.target as HTMLButtonElement)
                                }
                                ref={manualButton}
                            >
                                Press me!~
                            </button>
                            <div className="flex gap-1 flex-row flex-wrap">
                                {manualUpgrades}
                                {autoUpgrades}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

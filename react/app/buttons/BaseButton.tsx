"use client";

export type BaseButtonProps = {
    name: string;
    className?: string;
    disabled: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function BaseButton({
    name,
    className,
    disabled,
    onClick,
}: BaseButtonProps) {
    return (
        <button
            className={`btn basis-[30%] truncate${className ? ` ${className}` : ""}`}
            disabled={disabled}
            onClick={onClick}
        >
            {name}
        </button>
    );
}

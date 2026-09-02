import BaseButton, { BaseButtonProps } from "./BaseButton";

type ManualButtonProps = Omit<BaseButtonProps,'className'>

export default function AutoButton(props: ManualButtonProps) {
    return <BaseButton {...props} className={"btn-accent"} />;
}
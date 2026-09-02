import BaseButton, { BaseButtonProps } from "./BaseButton";

type ManualButtonProps = Omit<BaseButtonProps,'className'>

export default function ManualButton(props: ManualButtonProps) {
    return <BaseButton 
        {...props}
        className={"btn-info"}
    />
}
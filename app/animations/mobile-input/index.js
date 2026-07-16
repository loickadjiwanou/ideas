import LockScreen from "./lock-screen";

export default function MobileInput() {
  return (
    <LockScreen
      correctPin="11111"
      onError={wrongPin => {
        console.log({ wrongPin });
      }}
      onClear={() => {
        console.log('onClear');
      }}
      onCompleted={() => {
        console.log('onCompleted');
      }}
    />
  );
};

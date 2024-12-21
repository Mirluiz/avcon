interface Observer {
  trigger: () => void;
  dispose: () => void;
}

export { Observer };

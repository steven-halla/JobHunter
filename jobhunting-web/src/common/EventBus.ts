interface EventBus {
  on(event: string, callback: (detail: any) => void): void;
  dispatch(event: string, data: any): void;
  remove(event: string, callback: (e: Event) => void): void;
}

const eventBus: EventBus = {
  on(event: string, callback: (detail: any) => void): void {
    document.addEventListener(event, (e: Event) => callback((e as CustomEvent).detail));
  },
  dispatch(event: string, data: any): void {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event: string, callback: (e: Event) => void): void {
    document.removeEventListener(event, callback);
  },
};

export default eventBus;

export function createEventHandler(eventName) {
    const addEventListener = (fn) => {
        window.addEventListener(eventName, fn)
        return () => window.removeEventListener(eventName, fn)
    }

    const dispatch = (data) => {
        window.dispatchEvent(new CustomEvent(eventName, { detail: data }))
    }

    return {
        addEventListener,
        dispatch,
    }
}

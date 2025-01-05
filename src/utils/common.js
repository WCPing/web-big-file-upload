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

export function convertFileSize(size) {
    return (size / (1024 * 1024)).toFixed(2)
}

export function convertTime(time) {
    return (time / 1000).toFixed(2)
}

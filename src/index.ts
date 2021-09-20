import * as React from 'react';

enum Unit {
    Time,
    Point
}

interface Juncture<S> {
    state: S;
    time: Date;
}

/** A React hook which allows state to be traveled either via a point in time (based on time) or simply a point on a timeline (based on the position) */
function useSeek<S>(newState: S) {
    const [state, setState] = React.useState<S>();
    const [timeline, setTimeline] = React.useState<Juncture<S>[]>([]);

    function seek(extent: number | string, unit: Unit) {
        // A unit of Unit.Point is a simple index on the timeline array
        if (unit === Unit.Point) {
            const juncture = timeline[extent as number];
            if (juncture) {
                setState(timeline[extent as number].state);
            } else {
                console.warn('Point does not exist in the timeline.');
            }
        } else {
            // Find the juncture based on whether or not the existing timeline juncture is before the extend
            const juncture = timeline.find(item => {
                console.log('item...', item.time);
                console.log('item extent...', extent);
                return item.time < new Date(extent);
            });
            console.log('juncture match', juncture, extent);
            // If a juncture is found, set that as the new state
            if (juncture) {
                setState(juncture.state);
            } else {
                console.warn('Cannot go past the last state available in the timeline.');
            }
        }
    }

    /** Sets the state to the next point in time (next item in the timeline) */
    function next() {
        const currentPosition = timeline.findIndex(item => item.state === state);
        if (currentPosition !== timeline.length - 1) {
            setState(timeline[currentPosition + 1].state);
        } else {
            console.warn('Cannot go past the last state available in the timeline.');
        }
    }
    
    /** Sets the state to the previous point in time (previous item in the timeline) */
    function previous() {
        const currentPosition = timeline.findIndex(item => item.state === state);
        if (currentPosition) {
            setState(timeline[currentPosition - 1].state);
        } else {
            console.warn('Already at the first available state in the timeline.');
        }
    }

    React.useEffect(() => {
        setState(newState);
        setTimeline([...timeline, {
            state: newState,
            time: new Date()
        }]);
    }, [newState]);

    return {
        seek,
        next,
        previous,
        state,
        timeline 
    }
}

export default useSeek;
export { Unit, Juncture }


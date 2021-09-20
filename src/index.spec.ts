import {renderHook, act} from '@testing-library/react-hooks';

import useSeek, { Unit } from './index';

beforeAll(() => {
  jest.useFakeTimers();
});

beforeEach(() => {
  jest.spyOn(console, 'warn');
})

afterEach(() => {    
  jest.clearAllMocks();
});

// test('sets initial state', () => {
//   const { result } = renderHook(() => useSeek('first'));

//   expect(result.current.state).toEqual('first');
// });


// test('allows next', () => {
//   const { result, rerender } = renderHook((newState = 'first') => useSeek(newState));

//   expect(result.current.state).toEqual('first');
  
//   rerender('second');

//   expect(result.current.state).toEqual('second');

//   act(() => result.current.previous());
  
//   expect(result.current.state).toEqual('first');

//   act(() => result.current.next());

//   expect(result.current.state).toEqual('second');

//   act(() => result.current.next());

//   expect(result.current.state).toEqual('second');
//   expect(console.warn).toHaveBeenCalledTimes(1);
// });

// test('allows previous', () => {
//   const { result, rerender } = renderHook((newState = 'first') => useSeek(newState));

//   expect(result.current.state).toEqual('first');
  
//   rerender('second');

//   expect(result.current.state).toEqual('second');

//   act(() => result.current.previous());
  
//   expect(result.current.state).toEqual('first');
  
//   act(() => result.current.previous());

//   expect(result.current.state).toEqual('first');
//   expect(console.warn).toHaveBeenCalledTimes(1);
// });

// test('seek based on point', () => {
//   const { result, rerender } = renderHook((newState = 'first') => useSeek(newState));

//   expect(result.current.state).toEqual('first');
  
//   rerender('second');

//   expect(result.current.state).toEqual('second');

//   act(() => result.current.seek(0, Unit.Point));
  
//   expect(result.current.state).toEqual('first');
  
//   act(() => result.current.seek(9, Unit.Point));
  
//   expect(result.current.state).toEqual('first');
//   expect(console.warn).toHaveBeenCalledTimes(1);
// });

test('seek based on time', () => {
  const initialDate = new Date();
  initialDate.setSeconds(0);
  console.log('init', initialDate);
  jest.setSystemTime(initialDate);
  const beforeTimeline = new Date().toString();
  const { result, rerender } = renderHook((newState = 'first') => useSeek(newState));
  
  expect(result.current.state).toEqual('first');
  
  const dateToAdvanceBy10 = new Date();
  dateToAdvanceBy10.setSeconds(10);
  jest.setSystemTime(dateToAdvanceBy10);
  rerender('second');
  
  expect(result.current.state).toEqual('second');
  
  console.log('00--', result.current.timeline);
  act(() => result.current.seek(beforeTimeline, Unit.Time));
  
  // Time before the timeline exists should console warn
  expect(result.current.state).toEqual('second');
  expect(console.warn).toHaveBeenCalledTimes(1);
  
  // Time after the last state in the timeline should return the last state
  const timeAfter = new Date();
  timeAfter.setSeconds(20);
  act(() => result.current.seek(timeAfter.toString(), Unit.Time));
  expect(result.current.state).toEqual('second');

  console.log('00', result.current.timeline);

  // Time after the first state, but before the second state in the timeline
  // should return the first state
  const seekDate = new Date();
  seekDate.setSeconds(5);
  act(() => result.current.seek(seekDate.toString(), Unit.Time));
  expect(result.current.state).toEqual('first');
});
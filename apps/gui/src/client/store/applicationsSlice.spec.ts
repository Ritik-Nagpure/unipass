import { describe, it, expect } from 'vitest';
import reducer, {
  setApplications,
  addApplication,
  updateApplication,
  removeApplication,
  clearApplications,
  setLoading,
  setError,
} from './applicationsSlice';
import type { Application } from '../shared/services/applications';

const makeApp = (id: string, name = 'App'): Application => ({
  id,
  name,
  clientId: `up_${id}`,
  redirectUris: ['https://app.example.com/cb'],
  scopes: ['openid'],
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

describe('applicationsSlice', () => {
  it('starts empty', () => {
    const state = reducer(undefined, { type: 'init' });
    expect(state.applications).toEqual([]);
    expect(state.isLoading).toBe(false);
  });

  it('setApplications replaces the list and clears errors', () => {
    let state = reducer(undefined, setError('boom'));
    state = reducer(state, setApplications([makeApp('1'), makeApp('2')]));
    expect(state.applications).toHaveLength(2);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('addApplication prepends the new application', () => {
    let state = reducer(undefined, setApplications([makeApp('1')]));
    state = reducer(state, addApplication(makeApp('2', 'Second')));
    expect(state.applications[0].id).toBe('2');
    expect(state.applications).toHaveLength(2);
  });

  it('updateApplication replaces the matching item in place', () => {
    let state = reducer(undefined, setApplications([makeApp('1'), makeApp('2')]));
    state = reducer(state, updateApplication(makeApp('2', 'Renamed')));
    expect(state.applications.find((a) => a.id === '2')?.name).toBe('Renamed');
    expect(state.applications).toHaveLength(2);
  });

  it('removeApplication filters the item out', () => {
    let state = reducer(undefined, setApplications([makeApp('1'), makeApp('2')]));
    state = reducer(state, removeApplication('1'));
    expect(state.applications.map((a) => a.id)).toEqual(['2']);
  });

  it('clearApplications empties the list', () => {
    let state = reducer(undefined, setApplications([makeApp('1')]));
    state = reducer(state, clearApplications());
    expect(state.applications).toEqual([]);
  });

  it('setLoading / setError manage transient state', () => {
    let state = reducer(undefined, setLoading(true));
    expect(state.isLoading).toBe(true);
    state = reducer(state, setError('failed'));
    expect(state.error).toBe('failed');
    expect(state.isLoading).toBe(false);
  });
});
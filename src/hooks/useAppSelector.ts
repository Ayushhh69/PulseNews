/**
 * Typed useSelector hook for the app.
 */
import { useSelector } from 'react-redux';
import type { RootState } from '../store/rootReducer';

export const useAppSelector = useSelector.withTypes<RootState>();

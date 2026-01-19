import { useRef } from "react"

/**
 * Use this custom hook in useEffect() to ignore initial value if needed.
 * @see
 * https://stackoverflow.com/questions/65027884/which-is-the-right-way-to-detect-first-render-in-a-react-component
 * @example
 * const firstRender = useFirstRender();
 * useEffect(() => {
 *  if (firstRender) {
 *     return;
 *   }
 *   // do something else
 *}, [selectedIndex]);
 */
const useFirstRender = () => {
    const ref = useRef(true);
    const firstRender = ref.current;
    ref.current = false;
    return firstRender;
}

export default useFirstRender;
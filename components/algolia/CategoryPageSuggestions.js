import Link from "next/link";
import { useRouter } from "next/router";
import { useRefinementList } from "react-instantsearch";

/**
 * Count occurrences of a substring in a str.
 * @param {} str
 * @param {*} value
 * @returns
 */
function countOccurrences(str, value) {
  var regExp = new RegExp(value, "gi");
  return (str.match(regExp) || []).length;
}

/**
 * Replace All strings
 * @param {} str
 * @param {*} search
 * @param {*} replacement
 * @returns
 */
function replaceAll(str, search, replacement) {
  var regExp = new RegExp(search, "g");
  return str.replace(regExp, replacement).toLowerCase();
}

export function CategoryPageSuggestions() {
  const {
    items,
    refine
  } = useRefinementList({ attribute: "category_page_id" });

  const finalItems = items.sort((a, b) => {
    const compare = countOccurrences(b.value, ' > ') - countOccurrences(a.value, ' > ');
    return compare;
  }).slice(0, 5);

  // return (<div className="category-pages-btn">
  //   {finalItems.map((item) => {
  //     const url = `/algolia/c/${replaceAll(item.value, ' > ', '/')}`;
  //     return <li key={item.value} href={url}><button key={item.value} onClick={()=> {
  //       refine(item.value);
  //     }}>{item.label}</button></li>
  //   })}
  // </div>)

  return (<div className="category-pages-btn">
    {finalItems.map((item) => {
      const url = `/algolia/c/${replaceAll(item.value, ' > ', '/')}`;
      return <Link key={item.value} href={url}><button key={item.value}>{item.label}</button></Link>
    })}
  </div>)
}
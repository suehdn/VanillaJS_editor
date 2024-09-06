export function areEqual(value1, value2) {
  // 먼저 두 값이 동일한지 확인
  if (value1 === value2) return true;

  // 타입이 다르면 무조건 다름
  if (typeof value1 !== typeof value2 || value1 === null || value2 === null)
    return false;

  // Set 타입의 비교
  if (value1 instanceof Set && value2 instanceof Set) {
    if (value1.size !== value2.size) return false;
    for (let item of value1) {
      let found = false;
      for (let otherItem of value2) {
        if (areEqual(item, otherItem)) {
          found = true;
          break;
        }
      }
      if (!found) return false;
    }
    return true;
  }

  // Map 타입의 비교
  if (value1 instanceof Map && value2 instanceof Map) {
    if (value1.size !== value2.size) return false;
    for (let [key, value] of value1) {
      if (!value2.has(key)) return false;
      if (!areEqual(value, value2.get(key))) return false;
    }
    return true;
  }

  // 배열 타입의 비교
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) return false;
    for (let i = 0; i < value1.length; i++) {
      if (!areEqual(value1[i], value2[i])) return false;
    }
    return true;
  }

  // 객체 타입의 비교
  if (typeof value1 === "object" && typeof value2 === "object") {
    const keys1 = Object.keys(value1);
    const keys2 = Object.keys(value2);
    if (keys1.length !== keys2.length) return false;
    for (let key of keys1) {
      if (!keys2.includes(key) || !areEqual(value1[key], value2[key]))
        return false;
    }
    return true;
  }

  // 기본적으로 다른 타입은 false를 반환
  return false;
}

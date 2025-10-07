import { MENU_ITEMS } from '@/assets/data/menu-items';

/**
 * Filter menu items based on user role
 * @param {Array} items - Menu items array
 * @param {string} userRole - User's role
 * @returns {Array} Filtered menu items
 */
const filterMenuByRole = (items, userRole) => {
  if (!items || !Array.isArray(items)) return items;
  
  return items.filter(item => {
    // If item has requiredRoles, check if user has access
    if (item.requiredRoles && Array.isArray(item.requiredRoles)) {
      if (!userRole || !item.requiredRoles.includes(userRole)) {
        return false;
      }
    }
    
    // If item has children, filter them too
    if (item.children && Array.isArray(item.children)) {
      item.children = filterMenuByRole(item.children, userRole);
      // If all children are filtered out, hide the parent too
      if (item.children.length === 0) {
        return false;
      }
    }
    
    return true;
  });
};

export const getMenuItems = (userRole = null) => {
  if (!userRole) {
    return MENU_ITEMS;
  }
  
  return filterMenuByRole(MENU_ITEMS, userRole);
};
export const findAllParent = (menuItems, menuItem) => {
  let parents = [];
  const parent = findMenuItem(menuItems, menuItem.parentKey);
  if (parent) {
    parents.push(parent.key);
    if (parent.parentKey) {
      parents = [...parents, ...findAllParent(menuItems, parent)];
    }
  }
  return parents;
};
export const getMenuItemFromURL = (items, url) => {
  if (items instanceof Array) {
    for (const item of items) {
      const foundItem = getMenuItemFromURL(item, url);
      if (foundItem) {
        return foundItem;
      }
    }
  } else {
    if (items.url == url) return items;
    if (items.children != null) {
      for (const item of items.children) {
        if (item.url == url) return item;
      }
    }
  }
};
export const findMenuItem = (menuItems, menuItemKey) => {
  if (menuItems && menuItemKey) {
    for (const item of menuItems) {
      if (item.key === menuItemKey) {
        return item;
      }
      const found = findMenuItem(item.children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
};
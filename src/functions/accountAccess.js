export const ACCOUNT_TYPES = ["Admin", "Cashier"];
export const PERMISSIONS = ["add", "read", "edit", "delete"];
const ADMIN_MODULES = ["Account Registration", "Settings"];
const MODULES = [
  "POS", "PWD", "Delivery", "Inventories", "Discount", "Return and Exchange",
  "Sale Report", "Category", "Transaction Logs", "Void Logs", ...ADMIN_MODULES,
];

export function isAdminModule(drawerLink) {
  return ADMIN_MODULES.includes(drawerLink);
}

export function defaultAccess(accountType) {
  return MODULES.map((drawerLink) => ({
    drawerLink,
    accessRights: Object.fromEntries(PERMISSIONS.map((permission) => [
      permission,
      accountType === "Admin" || (permission === "read" && !isAdminModule(drawerLink)),
    ])),
  }));
}

export function enforceAccess(accountType, access) {
  return defaultAccess(accountType).map((row) => {
    if (accountType === "Admin" || isAdminModule(row.drawerLink)) return row;
    const saved = access.find((item) => item.drawerLink === row.drawerLink);
    if (saved) {
      PERMISSIONS.forEach((permission) => {
        row.accessRights[permission] = saved.accessRights?.[permission] === true;
      });
    }
    return row;
  });
}

// Account APIs persist permissions only, so infer the preset when reopening an account.
export function inferAccountType(access) {
  const hasFullAccess = MODULES.every((drawerLink) => {
    const row = access.find((item) => item.drawerLink === drawerLink);
    return PERMISSIONS.every((permission) => row?.accessRights?.[permission] === true);
  });
  return hasFullAccess ? "Admin" : "Cashier";
}

/* eslint-env jest */
import { defaultAccess, enforceAccess, inferAccountType, isAdminModule } from "../functions/accountAccess";

test("Admin selects every permission and restores unchecked permissions before saving", () => {
  const access = defaultAccess("Admin");
  expect(access.every((row) => Object.values(row.accessRights).every(Boolean))).toBe(true);
  access[0].accessRights.read = false;
  expect(enforceAccess("Admin", access)).toEqual(defaultAccess("Admin"));
});

test("Cashier defaults to read access and cannot retain admin permissions", () => {
  const access = enforceAccess("Cashier", defaultAccess("Admin"));
  expect(access.filter((row) => isAdminModule(row.drawerLink))).toHaveLength(2);
  access.filter((row) => isAdminModule(row.drawerLink)).forEach((row) => {
    expect(Object.values(row.accessRights).every((value) => !value)).toBe(true);
  });
  defaultAccess("Cashier").filter((row) => !isAdminModule(row.drawerLink)).forEach((row) => {
    expect(row.accessRights).toEqual({ add: false, read: true, edit: false, delete: false });
  });
});

test("editing preserves custom allowed permissions without mutating saved access", () => {
  const access = defaultAccess("Cashier");
  access[0].accessRights.add = true;
  const result = enforceAccess("Cashier", access);
  expect(result[0].accessRights.add).toBe(true);
  result[0].accessRights.read = false;
  expect(access[0].accessRights.read).toBe(true);
});

test("saved presets reopen with their selected account type", () => {
  expect(inferAccountType(defaultAccess("Admin"))).toBe("Admin");
  expect(inferAccountType(defaultAccess("Cashier"))).toBe("Cashier");
  expect(inferAccountType(enforceAccess("Cashier", defaultAccess("Admin")))).toBe("Cashier");
});

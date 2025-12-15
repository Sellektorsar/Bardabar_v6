import { describe, it, expect, beforeEach } from "vitest";
import { useMenuStore } from "../useMenuStore";

describe("useMenuStore", () => {
  beforeEach(() => {
    // Reset store before each test
    useMenuStore.setState({
      items: [],
      editingItem: null,
      newItem: {
        name: "",
        description: "",
        price: "",
        image: "",
        category: "Горячие блюда",
        isSpecial: false,
        allergens: [],
        calories: 0,
        isVegetarian: false,
        isVegan: false,
      },
    });
  });

  it("adds item when name and price are provided", () => {
    const store = useMenuStore.getState();

    store.setNewItem({
      name: "Стейк",
      description: "Сочный стейк",
      price: "1500",
      image: "",
      category: "Горячие блюда",
      isSpecial: true,
      allergens: [],
      calories: 500,
      isVegetarian: false,
      isVegan: false,
    });

    const result = useMenuStore.getState().addItem();
    expect(result).toBe(true);
    expect(useMenuStore.getState().items).toHaveLength(1);
    expect(useMenuStore.getState().items[0].name).toBe("Стейк");
  });

  it("does not add item without name", () => {
    const store = useMenuStore.getState();

    store.setNewItem({
      name: "",
      description: "",
      price: "1500",
      image: "",
      category: "Горячие блюда",
      isSpecial: false,
      allergens: [],
      calories: 0,
      isVegetarian: false,
      isVegan: false,
    });

    const result = useMenuStore.getState().addItem();
    expect(result).toBe(false);
    expect(useMenuStore.getState().items).toHaveLength(0);
  });

  it("updates existing item", () => {
    const store = useMenuStore.getState();

    // Add item first
    store.setItems([
      {
        id: 1,
        name: "Стейк",
        description: "",
        price: "1500",
        image: "",
        category: "Горячие блюда",
        isSpecial: false,
        allergens: [],
        calories: 0,
        isVegetarian: false,
        isVegan: false,
      },
    ]);

    // Set editing item
    store.setEditingItem({
      id: 1,
      name: "Стейк Рибай",
      description: "Обновлённое описание",
      price: "2000",
      image: "",
      category: "Горячие блюда",
      isSpecial: true,
      allergens: [],
      calories: 600,
      isVegetarian: false,
      isVegan: false,
    });

    const result = useMenuStore.getState().updateItem();
    expect(result).toBe(true);
    expect(useMenuStore.getState().items[0].name).toBe("Стейк Рибай");
    expect(useMenuStore.getState().items[0].price).toBe("2000");
    expect(useMenuStore.getState().editingItem).toBeNull();
  });

  it("deletes item by id", () => {
    const store = useMenuStore.getState();

    store.setItems([
      { id: 1, name: "Item 1", description: "", price: "100", image: "", category: "Горячие блюда", isSpecial: false, allergens: [], calories: 0, isVegetarian: false, isVegan: false },
      { id: 2, name: "Item 2", description: "", price: "200", image: "", category: "Горячие блюда", isSpecial: false, allergens: [], calories: 0, isVegetarian: false, isVegan: false },
    ]);

    store.deleteItem(1);

    expect(useMenuStore.getState().items).toHaveLength(1);
    expect(useMenuStore.getState().items[0].id).toBe(2);
  });
});

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { FiEdit3, FiTrash2, FiPlus } from 'react-icons/fi'
import { useUser } from './UserContext'
import { getMenuItems, updateMenuItem, createMenuItem, deleteMenuItem, getCategories, createCategory, updateCategory, deleteCategory, uploadCategoryImage, uploadMenuItemImage } from './api'
import Sidebar from './Sidebar.jsx'
import HeaderBar from './HeaderBar.jsx'
import Categories from './Categories.jsx'
import { onInventoryUpdate } from './inventorySync'
import dataSync from './dataSync'
import { PizzaIcon, BurgerIcon, ChickenIcon, BakeryIcon, BeverageIcon, SeafoodIcon, getCategoryIcon, getCategoryImage } from './Categories.jsx'

// Static icons array for cycling - defined outside component to prevent recreation
const AVAILABLE_ICONS = [
  { name: 'PizzaIcon', component: PizzaIcon },
  { name: 'BurgerIcon', component: BurgerIcon },
  { name: 'ChickenIcon', component: ChickenIcon },
  { name: 'BakeryIcon', component: BakeryIcon },
  { name: 'BeverageIcon', component: BeverageIcon },
  { name: 'SeafoodIcon', component: SeafoodIcon }
];

const colors = {
  bg: '#111315',
  panel: '#292C2D',
  text: '#FFFFFF',
  accent: '#FAC1D9',
  muted: '#777979',
  line: '#3D4142',
  inputBg: '#3D4142',
}


export default function Menu() {
  const navigate = useNavigate()
  const { user, loading } = useUser()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeMenuType, setActiveMenuType] = useState('Normal Menu')
  const [selectedItems, setSelectedItems] = useState([])
  const [filteredMenuItems, setFilteredMenuItems] = useState([])
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  const [isEditIconModalOpen, setIsEditIconModalOpen] = useState(false)
  const [isAddMenuItemModalOpen, setIsAddMenuItemModalOpen] = useState(false)
  const [isEditMenuItemModalOpen, setIsEditMenuItemModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [menuItemsData, setMenuItemsData] = useState([])
  const [editImageFile, setEditImageFile] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState(null)
  
  // Category management states
  const [categoriesData, setCategoriesData] = useState([])
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false)
  const [editingCategoryData, setEditingCategoryData] = useState(null)
  const [categoryImageFile, setCategoryImageFile] = useState(null)
  const [categoryImagePreview, setCategoryImagePreview] = useState(null)
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: '',
    image: null
  })
  const [editCategoryForm, setEditCategoryForm] = useState({
    name: '',
    image: null
  })

  const [addCategoryForm, setAddCategoryForm] = useState({
    name: '',
    description: '',
    menu: 'Normal Menu'
  })
  
  // Edit Icon Modal state
  const [editIconForm, setEditIconForm] = useState({
    name: '',
    menu: 'Normal Menu',
    description: '',
    icon: null,
    iconIndex: 0
  })
  
  // Add Menu Item image state
  const [addImageFile, setAddImageFile] = useState(null)
  const [addImagePreview, setAddImagePreview] = useState(null)

  // Initialize menu items data
  const fetchMenuItems = async () => {
    try {
      console.log('Fetching menu items from API...');
      const items = await getMenuItems();
      console.log('API returned items:', items);
      
      if (items && items.length > 0) {
        // Transform API data using centralized data sync
        const transformedItems = items.map(item => dataSync.standardizeMenuItem({
          ...item,
          apiId: item.id
        }));
        
        console.log('Transformed items:', transformedItems);
        setMenuItemsData(transformedItems);
        
        // Update centralized data sync
        dataSync.broadcastUpdate('menuItems', transformedItems);
      } else {
        console.log('No items returned from API, using fallback data');
        console.log('Fallback menu items:', menuItems);
        const standardizedFallback = menuItems.map(item => dataSync.standardizeMenuItem(item));
        setMenuItemsData(standardizedFallback);
        
        // Update centralized data sync
        dataSync.broadcastUpdate('menuItems', standardizedFallback);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      console.log('Using fallback local data');
      console.log('Fallback menu items:', menuItems);
      // Fallback to local data if API fails
      const standardizedFallback = menuItems.map(item => dataSync.standardizeMenuItem(item));
      setMenuItemsData(standardizedFallback);
      
      // Update centralized data sync
      dataSync.broadcastUpdate('menuItems', standardizedFallback);
    }
  };

  // Calculate real counts for categories based on menu items
  const calculateCategoryCounts = (categories, menuItems) => {
    return categories.map(category => {
      if (category.id === 'all') {
        // For "All" category, show total count of all menu items
        return {
          ...category,
          count: menuItems.length
        };
      } else {
        // For specific categories, count items in that category
        const count = menuItems.filter(item => {
          const itemCategory = typeof item.category === 'string' ? item.category : item.category?.name;
          return itemCategory?.toLowerCase() === category.name.toLowerCase();
        }).length;
        return {
          ...category,
          count: count
        };
      }
    });
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const categories = await getCategories();
      // Transform API data to match expected format
      const transformedCategories = categories.map(category => ({
        id: category.id,
        name: category.name,
        image: category.image,
        icon: getCategoryIcon(category.name),
        count: category.items ? category.items.length : 0,
        active: true
      }));
      
      // Always include "All Items" category at the beginning
      const allItemsCategory = {
        id: 'all',
        name: 'All Items',
        image: getCategoryImage('All Items'),
        icon: getCategoryIcon('All Items'),
        count: 0,
        active: true
      };
      
      const categoriesWithAll = [allItemsCategory, ...transformedCategories];
      
      // Update with real counts from menu items using centralized data sync
      const categoriesWithRealCounts = dataSync.calculateCategoryCounts(categoriesWithAll, menuItemsData);
      setCategoriesData(categoriesWithRealCounts);
      
      // Update centralized data sync
      dataSync.broadcastUpdate('categories', categoriesWithRealCounts);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories
      const defaultCategories = [
        { id: 'all', name: 'All Items', image: getCategoryImage('All Items'), icon: getCategoryIcon('All Items'), count: 0, active: true },
        { id: '1', name: 'Pizza', image: getCategoryImage('Pizza'), icon: getCategoryIcon('Pizza'), count: 0, active: true },
        { id: '2', name: 'Burger', image: getCategoryImage('Burger'), icon: getCategoryIcon('Burger'), count: 0, active: true },
        { id: '3', name: 'Chicken', image: getCategoryImage('Chicken'), icon: getCategoryIcon('Chicken'), count: 0, active: true },
        { id: '4', name: 'Beverage', image: getCategoryImage('Beverage'), icon: getCategoryIcon('Beverage'), count: 0, active: true },
        { id: '5', name: 'Seafood', image: getCategoryImage('Seafood'), icon: getCategoryIcon('Seafood'), count: 0, active: true },
        { id: '6', name: 'Bakery', image: getCategoryImage('Bakery'), icon: getCategoryIcon('Bakery'), count: 0, active: true }
      ];
      
      // Update with real counts from menu items using centralized data sync
      const categoriesWithRealCounts = dataSync.calculateCategoryCounts(defaultCategories, menuItemsData);
      setCategoriesData(categoriesWithRealCounts);
      
      // Update centralized data sync
      dataSync.broadcastUpdate('categories', categoriesWithRealCounts);
    }
  };
    
  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
    
    // Subscribe to real-time data updates
    const unsubscribeMenuItems = dataSync.subscribe('menuItems', (updatedItems) => {
      setMenuItemsData(updatedItems);
    });
    
    const unsubscribeCategories = dataSync.subscribe('categories', (updatedCategories) => {
      setCategoriesData(updatedCategories);
    });
    
    // Listen for global data updates
    const handleGlobalUpdate = (event) => {
      const { type, data } = event.detail;
      if (type === 'menuItems') {
        setMenuItemsData(data);
      } else if (type === 'categories') {
        setCategoriesData(data);
      }
    };
    
    window.addEventListener('cosypos-data-update', handleGlobalUpdate);
    
    return () => {
      unsubscribeMenuItems();
      unsubscribeCategories();
      window.removeEventListener('cosypos-data-update', handleGlobalUpdate);
    };
  }, []);

  // Update category counts when menu items change
  useEffect(() => {
    if (menuItemsData.length > 0 && categoriesData.length > 0) {
      const updatedCategories = calculateCategoryCounts(categoriesData, menuItemsData);
      setCategoriesData(updatedCategories);
    }
  }, [menuItemsData]);

  // Refresh menu items when component becomes visible (for real-time updates)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchMenuItems();
        fetchCategories();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Real-time updates - refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMenuItems();
      fetchCategories();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Initialize categories data
  useEffect(() => {
    const savedCategories = localStorage.getItem('inventoryCategories');
    if (savedCategories) {
      const inventoryCategories = JSON.parse(savedCategories);
      const defaultCategories = [
        { id: 'all', name: 'All Items', icon: getCategoryIcon('All Items'), count: 0, active: true },
        ...inventoryCategories.map(category => ({
          id: category.toLowerCase(),
          name: category,
          icon: getCategoryIcon(category),
          count: 0
        }))
      ];
      
      // Update with real counts from menu items
      const categoriesWithRealCounts = calculateCategoryCounts(defaultCategories, menuItemsData);
      setCategoriesData(categoriesWithRealCounts);
    } else {
      // Use default categories with correct counts
      const defaultCategories = [
        { id: 'all', name: 'All Items', image: getCategoryImage('All Items'), icon: getCategoryIcon('All Items'), count: 0, active: true },
        { id: 'pizza', name: 'Pizza', image: getCategoryImage('Pizza'), icon: getCategoryIcon('Pizza'), count: 0 },
        { id: 'burger', name: 'Burger', image: getCategoryImage('Burger'), icon: getCategoryIcon('Burger'), count: 0 },
        { id: 'chicken', name: 'Chicken', image: getCategoryImage('Chicken'), icon: getCategoryIcon('Chicken'), count: 0 },
        { id: 'beverage', name: 'Beverage', image: getCategoryImage('Beverage'), icon: getCategoryIcon('Beverage'), count: 0 },
        { id: 'seafood', name: 'Seafood', image: getCategoryImage('Seafood'), icon: getCategoryIcon('Seafood'), count: 0 },
        { id: 'bakery', name: 'Bakery', image: getCategoryImage('Bakery'), icon: getCategoryIcon('Bakery'), count: 0 },
      ];
      
      // Update with real counts from menu items
      const categoriesWithRealCounts = calculateCategoryCounts(defaultCategories, menuItemsData);
      setCategoriesData(categoriesWithRealCounts);
    }
  }, []);

  // Filter menu items based on active category
  useEffect(() => {
    if (menuItemsData.length > 0) {
      if (activeCategory === 'all') {
        setFilteredMenuItems(menuItemsData);
      } else {
        // Find the category name from categoriesData
        const selectedCategory = categoriesData.find(cat => cat.id === activeCategory);
        if (selectedCategory) {
          const filtered = menuItemsData.filter(item => {
            const itemCategory = typeof item.category === 'string' ? item.category : item.category?.name;
            return itemCategory?.toLowerCase() === selectedCategory.name.toLowerCase();
          });
          setFilteredMenuItems(filtered);
        } else {
          setFilteredMenuItems(menuItemsData);
        }
      }
    }
  }, [menuItemsData, activeCategory, categoriesData]);

  // Listen for changes in localStorage to update categories in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCategories = localStorage.getItem('inventoryCategories');
      if (savedCategories) {
        const inventoryCategories = JSON.parse(savedCategories);
        const defaultCategories = [
          { id: 'all', name: 'All Items', icon: getCategoryIcon('All Items'), count: 0, active: true },
          ...inventoryCategories.map(category => ({
            id: category.toLowerCase(),
            name: category,
            icon: getCategoryIcon(category),
            count: 0
          }))
        ];
        
        // Update with real counts from menu items
        const categoriesWithRealCounts = calculateCategoryCounts(defaultCategories, menuItemsData);
        setCategoriesData(categoriesWithRealCounts);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const [addMenuItemForm, setAddMenuItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    availability: 'In Stock'
  })

  // Listen for inventory updates from other components
  useEffect(() => {
    const cleanup = onInventoryUpdate((updatedItem, allItems) => {
      // Update the menu items data with the updated inventory item
      setMenuItemsData(prev => prev.map(item => {
        // Find matching item by name and category
        if (item.name === updatedItem.name && item.category === updatedItem.category?.name) {
          return {
            ...item,
            stock: updatedItem.stock,
            availability: updatedItem.availability
          };
        }
        return item;
      }));
    });
    
    return cleanup;
  }, []);

  // Clear text selection when clicking outside and auto-deselect categories
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.getSelection) {
        window.getSelection().removeAllRanges()
      }
      
      // Auto-deselect category when clicking outside categories area
      const categoriesContainer = event.target.closest('[data-categories-container]')
      if (!categoriesContainer && activeCategory !== 'all') {
        setActiveCategory('all')
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [activeCategory])

  // Debug logging
  console.log('Menu component - User:', user)
  console.log('Menu component - User role:', user?.role)
  console.log('Menu component - Loading:', loading)
  
  // Show loading state if user is still loading
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: colors.bg, 
        color: colors.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ fontSize: 18, fontWeight: 500 }}>Loading menu...</div>
      </div>
    )
  }

  // If not loading but no user, redirect to login
  if (!user) {
    navigate('/', { replace: true })
    return null
  }



  // Menu types
  const menuTypes = [
    { id: 'normal', name: 'Normal Menu' },
    { id: 'special', name: 'Special Deals' },
    { id: 'newyear', name: 'New Year Special' },
    { id: 'desserts', name: 'Deserts and Drinks' },
  ]

  // Menu items data (fallback)
  const menuItems = [
    // Pizza Items
    {
      id: '#1',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
      image: '/pizza.jpg',
      stock: 50,
      category: 'Pizza',
      price: '$25.00',
      availability: 'In Stock',
      active: true
    },
    {
      id: '#2',
      name: 'Pepperoni Pizza',
      description: 'Delicious pizza topped with spicy pepperoni and mozzarella',
      image: '/pizza.jpg',
      stock: 45,
      category: 'Pizza',
      price: '$28.00',
      availability: 'In Stock',
      active: true
    },
    {
      id: '#3',
      name: 'BBQ Chicken Pizza',
      description: 'Grilled chicken with BBQ sauce, onions, and cheese',
      image: '/pizza.jpg',
      stock: 35,
      category: 'Pizza',
      price: '$32.00',
      availability: 'In Stock',
      active: true
    },
    {
      id: '#4',
      name: 'Veggie Supreme Pizza',
      description: 'Loaded with bell peppers, mushrooms, onions, and olives',
      image: '/pizza.jpg',
      stock: 40,
      category: 'Pizza',
      price: '$26.00',
      availability: 'In Stock',
      active: true
    },
    
    // Burger Items
    {
      id: '#5',
      name: 'Classic Burger',
      description: 'Juicy beef patty with lettuce, tomato, and special sauce',
      image: '/burger.jpg',
      stock: 75,
      category: 'Burger',
      price: '$18.00',
      availability: 'In Stock',
      active: true
    },
    {
      id: '#6',
      name: 'Chicken Burger',
      description: 'Grilled chicken breast with lettuce, tomato, and mayo',
      image: '/burger.jpg',
      stock: 60,
      category: 'Burger',
      price: '$20.00',
      availability: 'In Stock',
      active: true
    },
    {
      id: '#7',
      name: 'Cheeseburger',
      description: 'Beef patty with melted cheese, lettuce, and tomato',
      image: '/burger.jpg',
      stock: 55,
      category: 'Burger',
      price: '$21.00',
      availability: 'In Stock',
      active: true
    },
    {
      id: '#8',
      name: 'Bacon Burger',
      description: 'Beef patty with crispy bacon and cheddar cheese',
      image: '/burger.jpg',
      stock: 45,
      category: 'Burger',
      price: '$24.00',
      availability: 'In Stock',
      active: true
    },
    
    // Chicken Items
    {
      id: '#9',
      name: 'Chicken Parmesan',
      description: 'Breaded chicken breast with marinara sauce and mozzarella cheese',
      image: '/chicken-parmesan.png',
      stock: 65,
      category: 'Chicken',
      price: '$22.00',
      availability: 'In Stock',
      active: true
    },
    {
      id: '#10',
      name: 'Grilled Chicken',
      description: 'Tender grilled chicken breast with herbs and spices',
      image: '/grill chicken.jpg',
      stock: 70,
      category: 'Chicken',
      price: '$19.00',
      availability: 'In Stock',
      active: true
    },
    
    // Beverage Items
    {
      id: '#11',
      name: 'Coca Cola',
      description: 'Refreshing cola drink',
      image: '/cococola.jpg',
      stock: 100,
      category: 'Beverage',
      price: '$3.00',
      availability: 'In Stock',
      active: true
    },
    {
      id: '#12',
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice',
      image: '/orange juice.jpg',
      stock: 80,
      category: 'Beverage',
      price: '$4.00',
      availability: 'In Stock',
      active: true
    },
    
    // Seafood Items
    {
      id: '#13',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon grilled to perfection',
      image: '/salamon.jpg',
      stock: 25,
      category: 'Seafood',
      price: '$35.00',
      availability: 'In Stock',
      active: true
    },
    
    // Bakery Items
    {
      id: '#14',
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake with chocolate frosting',
      image: '/choclate cake.jpg',
      stock: 30,
      category: 'Bakery',
      price: '$8.00',
      availability: 'In Stock',
      active: true
    },
    {
      id: '#15',
      name: 'Apple Pie',
      description: 'Homemade apple pie with cinnamon and sugar',
      image: '/apple pie.jpg',
      stock: 35,
      category: 'Bakery',
      price: '$7.00',
      availability: 'In Stock',
      active: true
    },
  ]

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId)
  }

  const handleMenuTypeClick = (menuTypeId) => {
    setActiveMenuType(menuTypeId)
  }

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredMenuItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredMenuItems.map(item => item.id))
    }
  }

  const handleEditItem = (itemId) => {
    const item = menuItemsData.find(item => item.id === itemId)
    if (item) {
      setEditingItem(itemId)
      setEditFormData({
        name: item.name,
        description: item.description,
        price: item.price.replace('$', ''),
        category: item.category,
        stock: item.stock,
        availability: item.availability
      })
      setEditImageFile(null)
      setEditImagePreview(null)
      setIsEditMenuItemModalOpen(true)
    }
  }

  const handleEditImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setEditImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveEdit = async () => {
    if (editingItem) {
      try {
        // Find the original item to get the API ID
        const originalItem = menuItemsData.find(item => item.id === editingItem)
        if (originalItem && originalItem.apiId) {
          const updateData = {
            name: editFormData.name,
            description: editFormData.description,
            priceCents: Math.round(parseFloat(editFormData.price) * 100),
            stock: parseInt(editFormData.stock),
            availability: editFormData.availability,
            category: editFormData.category
          }
          
          // Handle image upload if new image is selected
          if (editImageFile) {
            try {
              const formData = new FormData()
              formData.append('image', editImageFile)
              formData.append('menuItemData', JSON.stringify(updateData))
              
              // Try to upload image and update menu item
              const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/menu-items/${originalItem.apiId}/image`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
              })
              
              if (!response.ok) {
                console.warn('Image upload endpoint not available, storing image locally')
                // Fallback: Store image in localStorage and update menu item
                const imageKey = `menu_item_image_${originalItem.apiId}`
                localStorage.setItem(imageKey, editImagePreview)
                
                await updateMenuItem(originalItem.apiId, updateData)
                
                // Update local state with new image using standardized format
                const updatedItem = dataSync.standardizeMenuItem({
                  ...originalItem,
                  name: editFormData.name,
                  description: editFormData.description,
                  price: `$${parseFloat(editFormData.price).toFixed(2)}`,
                  category: editFormData.category,
                  stock: parseInt(editFormData.stock),
                  availability: editFormData.availability,
                  image: editImagePreview // Use the new image
                });
                
                setMenuItemsData(prev => prev.map(item => 
                  item.id === editingItem ? updatedItem : item
                ));
                
                // Update centralized data sync
                dataSync.updateMenuItem(editingItem, updatedItem);
              } else {
                const updatedItem = await response.json()
                
                // Update local state with new image
                setMenuItemsData(prev => prev.map(item => 
                  item.id === editingItem 
                    ? {
                        ...item,
                        name: updatedItem.name,
                        description: updatedItem.description,
                        price: `$${(updatedItem.priceCents / 100).toFixed(2)}`,
                        stock: updatedItem.stock,
                        category: updatedItem.category?.name || editFormData.category,
                        availability: updatedItem.availability,
                        image: updatedItem.image || item.image
                      }
                    : item
                ))
              }
            } catch (error) {
              console.warn('Image upload failed, storing image locally:', error)
              // Fallback: Store image in localStorage and update menu item
              const imageKey = `menu_item_image_${originalItem.apiId}`
              localStorage.setItem(imageKey, editImagePreview)
              
              await updateMenuItem(originalItem.apiId, updateData)
              
              // Update local state with new image
              setMenuItemsData(prev => prev.map(item => 
                item.id === editingItem 
                  ? {
                      ...item,
                      name: editFormData.name,
                      description: editFormData.description,
                      price: `$${parseFloat(editFormData.price).toFixed(2)}`,
                      category: editFormData.category,
                      stock: parseInt(editFormData.stock),
                      availability: editFormData.availability,
                      image: editImagePreview // Use the new image
                    }
                  : item
              ))
            }
          } else {
            // Update via API without image change
            await updateMenuItem(originalItem.apiId, updateData)
            
            // Update local state
            setMenuItemsData(prev => prev.map(item => 
              item.id === editingItem 
                ? {
                    ...item,
                    name: editFormData.name,
                    description: editFormData.description,
                    price: `$${parseFloat(editFormData.price).toFixed(2)}`,
              category: editFormData.category,
              stock: parseInt(editFormData.stock),
              availability: editFormData.availability
            }
          : item
      ))
          }
        }
        
      setEditingItem(null)
      setEditFormData({})
        setEditImageFile(null)
        setEditImagePreview(null)
        setIsEditMenuItemModalOpen(false)
      } catch (error) {
        console.error('Error updating menu item:', error)
        // Still update local state even if API fails
        setMenuItemsData(prev => prev.map(item => 
          item.id === editingItem 
            ? {
                ...item,
                name: editFormData.name,
                description: editFormData.description,
                price: `$${parseFloat(editFormData.price).toFixed(2)}`,
                category: editFormData.category,
                stock: parseInt(editFormData.stock),
                availability: editFormData.availability,
                image: editImagePreview || item.image
              }
            : item
        ))
        setEditingItem(null)
        setEditFormData({})
        setEditImageFile(null)
        setEditImagePreview(null)
        setIsEditMenuItemModalOpen(false)
        
        // Only refresh if no image upload was attempted or if image upload was successful
        if (!editImageFile) {
          // Refresh menu items from API to ensure data consistency
          await fetchMenuItems()
        }
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditFormData({})
    setEditImageFile(null)
    setEditImagePreview(null)
    setIsEditMenuItemModalOpen(false)
  }

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        // Find the original item to get the API ID
        const originalItem = menuItemsData.find(item => item.id === itemId)
        if (originalItem && originalItem.apiId) {
          // Delete via API
          await deleteMenuItem(originalItem.apiId)
        }
        
        // Update local state
        setMenuItemsData(prev => prev.filter(item => item.id !== itemId));
        setSelectedItems(prev => prev.filter(id => id !== itemId));
        
        // Update centralized data sync
        dataSync.removeMenuItem(itemId);
      } catch (error) {
        console.error('Error deleting menu item:', error)
        // Still update local state even if API fails
      setMenuItemsData(prev => prev.filter(item => item.id !== itemId))
      setSelectedItems(prev => prev.filter(id => id !== itemId))
      }
    }
  }

  const handleAddCategory = () => {
    setIsAddCategoryModalOpen(true)
  }

  const handleEditIcon = (category) => {
    setEditingCategory(category)
    
    // Find the current icon index in the available icons array
    let iconIndex = 0;
    if (category.icon) {
      const currentIconName = category.icon.type?.name;
      iconIndex = AVAILABLE_ICONS.findIndex(icon => icon.name === currentIconName);
      if (iconIndex === -1) iconIndex = 0;
    }
    
    setEditIconForm({
      name: category.name || '',
      menu: 'Normal Menu',
      description: category.description || '',
      icon: category.icon || null,
      iconIndex: iconIndex
    })
    setIsEditIconModalOpen(true)
  }

  const handleEditIconSave = async () => {
    try {
      if (!editIconForm.name.trim()) {
        // Show user-friendly notification instead of alert
        setIsNotificationOpen(true);
        setTimeout(() => setIsNotificationOpen(false), 3000);
        return;
      }
      
      // Get the current icon component from the index
      const currentIconData = AVAILABLE_ICONS[editIconForm.iconIndex];
      const IconComponent = currentIconData.component;
      
      // Construct the updated category payload
      const updatedCategoryData = {
        name: editIconForm.name,
        description: editIconForm.description,
        icon: <IconComponent />
      };
      
      // Call the update API
      const updatedCategory = await updateCategory(editingCategory.id, updatedCategoryData);
      
      // Update categories data after successful API call
      setCategoriesData(prev => 
        prev.map(cat => cat.id === editingCategory.id ? updatedCategory : cat)
      );
      
      handleCloseModals();
    } catch (error) {
      console.error('Error updating category:', error);
      // Show user-friendly notification instead of alert
      setIsNotificationOpen(true);
      setTimeout(() => setIsNotificationOpen(false), 3000);
    }
  };

  const handleCloseModals = () => {
    setIsAddCategoryModalOpen(false)
    setIsEditIconModalOpen(false)
    setIsAddMenuItemModalOpen(false)
    setIsEditMenuItemModalOpen(false)
    setIsEditCategoryModalOpen(false)
    setEditingCategory(null)
    setEditingItem(null)
    setEditingCategoryData(null)
    setEditFormData({})
    setAddCategoryForm({ name: '', description: '', menu: 'Normal Menu' })
    setEditIconForm({ name: '', menu: 'Normal Menu', description: '', icon: null, iconIndex: 0 })
    setAddMenuItemForm({ name: '', description: '', price: '', category: '', stock: '', availability: 'In Stock' })
    setNewCategoryForm({ name: '', image: null })
    setEditCategoryForm({ name: '', image: null })
    setCategoryImageFile(null)
    setCategoryImagePreview(null)
    setAddImageFile(null)
    setAddImagePreview(null)
    setEditImageFile(null)
    setEditImagePreview(null)
  }

  const handleAddCategorySubmit = async () => {
    if (newCategoryForm.name.trim()) {
      try {
        let imageUrl = null;
        
        // Upload image if provided
        if (categoryImageFile) {
          try {
            const uploadResult = await uploadCategoryImage(categoryImageFile);
            imageUrl = uploadResult.imageUrl;
          } catch (error) {
            console.warn('Image upload failed, creating category without image:', error);
          }
        }
        
        // Create category via API
        const categoryData = {
          name: newCategoryForm.name,
          image: imageUrl
        };
        
        const newCategory = await createCategory(categoryData);
        
        // Add to categories data with proper formatting
        const formattedCategory = {
          id: newCategory.id,
          name: newCategory.name,
          image: newCategory.image || getCategoryImage(newCategory.name),
          icon: getCategoryIcon(newCategory.name),
          count: 0, // Will be updated by calculateCategoryCounts
          active: true
        };
        
        setCategoriesData(prev => {
          const updated = [...prev, formattedCategory];
          return calculateCategoryCounts(updated, menuItemsData);
        });
        
        handleCloseModals();
      } catch (error) {
        console.error('Error creating category:', error);
        alert('Failed to create category. Please try again.');
      }
    }
  }

  // New category management handlers
  const handleEditCategory = (category) => {
    if (category === 'bulk') {
      // Handle bulk edit - show all categories for editing
      setIsEditCategoryModalOpen(true);
      setEditingCategoryData(null); // No specific category selected for bulk edit
      setEditCategoryForm({ name: '', image: null });
      setCategoryImagePreview(null);
    } else {
      // Handle individual category edit
      setEditingCategoryData(category);
      setEditCategoryForm({
        name: category.name,
        image: category.image
      });
      setCategoryImagePreview(category.image);
      setIsEditCategoryModalOpen(true);
    }
  }

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setCategoryImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  const handleEditCategorySubmit = async () => {
    if (editCategoryForm.name.trim()) {
      try {
        let imageUrl = editCategoryForm.image;
        
        // Upload new image if provided
        if (categoryImageFile) {
          try {
            const uploadResult = await uploadCategoryImage(categoryImageFile);
            imageUrl = uploadResult.imageUrl;
          } catch (error) {
            console.warn('Image upload failed, updating category without new image:', error);
          }
        }
        
        // Update category via API
        const categoryData = {
          name: editCategoryForm.name,
          image: imageUrl
        };
        
        const updatedCategory = await updateCategory(editingCategoryData.id, categoryData);
        
        // Update categories data with proper formatting
        const formattedCategory = {
          id: updatedCategory.id,
          name: updatedCategory.name,
          image: updatedCategory.image || getCategoryImage(updatedCategory.name),
          icon: getCategoryIcon(updatedCategory.name),
          count: 0, // Will be updated by calculateCategoryCounts
          active: true
        };
        
        setCategoriesData(prev => {
          const updated = prev.map(cat => 
            cat.id === editingCategoryData.id ? formattedCategory : cat
          );
          return calculateCategoryCounts(updated, menuItemsData);
        });
        
        handleCloseModals();
      } catch (error) {
        console.error('Error updating category:', error);
        alert('Failed to update category. Please try again.');
      }
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This will also remove all menu items in this category.')) {
      try {
        await deleteCategory(categoryId);
        
        // Remove category from categories data
        setCategoriesData(prev => {
          const updated = prev.filter(cat => cat.id !== categoryId);
          return calculateCategoryCounts(updated, menuItemsData);
        });
        
        // Remove menu items that belong to this category
        const deletedCategory = categoriesData.find(cat => cat.id === categoryId);
        if (deletedCategory) {
          setMenuItemsData(prev => prev.filter(item => 
            item.category?.toLowerCase() !== deletedCategory.name.toLowerCase()
          ));
        }
        
        // Reset active category if it was deleted
        if (activeCategory === categoryId) {
          setActiveCategory('all');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category. Please try again.');
      }
    }
  }

  const handleAddMenuItemSubmit = async () => {
    if (addMenuItemForm.name.trim() && addMenuItemForm.price && addMenuItemForm.category) {
      try {
        const newMenuItemData = {
          name: addMenuItemForm.name,
          description: addMenuItemForm.description,
          priceCents: Math.round(parseFloat(addMenuItemForm.price) * 100),
          stock: parseInt(addMenuItemForm.stock) || 0,
          category: addMenuItemForm.category,
          availability: addMenuItemForm.availability,
          active: true
        }
        
        // Create via API
        const createdItem = await createMenuItem(newMenuItemData)
        
        // Add to local state using standardized format
        const newMenuItem = dataSync.standardizeMenuItem({
          ...createdItem,
          apiId: createdItem.id,
          category: createdItem.category?.name || addMenuItemForm.category
        });
        
        setMenuItemsData(prev => [...prev, newMenuItem]);
        
        // Update centralized data sync
        dataSync.addMenuItem(newMenuItem);
        
        handleCloseModals();
      } catch (error) {
        console.error('Error creating menu item:', error)
        // Still add to local state even if API fails
      const newMenuItem = {
        id: `#${Date.now()}`,
        name: addMenuItemForm.name,
        description: addMenuItemForm.description,
          image: '/chicken-parmesan.png',
        stock: parseInt(addMenuItemForm.stock) || 0,
        category: addMenuItemForm.category,
        price: `$${parseFloat(addMenuItemForm.price).toFixed(2)}`,
        availability: addMenuItemForm.availability,
        active: true
      }
      setMenuItemsData(prev => [...prev, newMenuItem])
      handleCloseModals()
      }
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModals()
    }
  }

  const handleAddMenuItem = () => {
    setIsAddMenuItemModalOpen(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { 
              opacity: 0; 
              transform: scale(0.9) translateY(-20px); 
            }
            to { 
              opacity: 1; 
              transform: scale(1) translateY(0); 
            }
          }
          @keyframes slideOut {
            from { 
              opacity: 1; 
              transform: scale(1) translateY(0); 
            }
            to { 
              opacity: 0; 
              transform: scale(0.9) translateY(-20px); 
            }
          }
        `}
      </style>
      <div style={{ width: 1440, margin: '0 auto', position: 'relative' }}>
        <Sidebar />
        
        <HeaderBar 
          title="Menu" 
          showBackButton={true} 
          right={(
            <>
              {/* Notification Bell Container */}
              <div 
                onClick={() => navigate('/notifications')}
                style={{ 
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <Bell size={20} color="#FFFFFF" />
                
                {/* Notification Badge */}
                <div style={{ 
                  position: 'absolute',
                  width: 10.4,
                  height: 10.4,
                  top: -2,
                  right: -2,
                  background: colors.accent,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ 
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: 5.94335,
                    lineHeight: '9px',
                    color: '#333333',
                    textAlign: 'center'
                  }}>
                    01
                  </span>
                </div>
              </div>

              {/* Separator Line */}
              <div style={{ 
                width: 0,
                height: 22.29,
                border: '0.742918px solid #FFFFFF',
                margin: '0 8px'
              }} />

              {/* User Profile */}
              <div 
                onClick={() => navigate('/profile')}
                style={{ 
                  width: 37.15,
                  height: 37.15,
                  borderRadius: '50%',
                  border: '1.48584px solid #FAC1D9',
                  background: '#D9D9D9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)'
                  e.target.style.borderColor = '#FFB6C1'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)'
                  e.target.style.borderColor = '#FAC1D9'
                }}
              >
                <img 
                  src={user?.profileImage ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${user.profileImage}` : "/profile img icon.jpg"} 
                  alt="Profile" 
                  loading="lazy"
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                  onError={(e) => {
                    // Fallback to default image if uploaded image fails to load
                    e.target.src = "/profile img icon.jpg";
                  }}
                />
              </div>
            </>
          )} 
        />

        <main style={{ 
          paddingLeft: 208, 
          paddingRight: 32, 
          paddingTop: 20, 
          paddingBottom: 32
        }}>
          
          {/* Categories Section */}
          <Categories
            categories={categoriesData}
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
            user={user}
            layout="horizontal"
            showAddButton={true}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />

          {/* Menu Types and Items Section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: 16,
              marginTop: 20
            }}>
              <h2 style={{ 
                fontSize: 20, 
                fontWeight: 600, 
                color: colors.text,
                margin: 0
              }}>
                {user?.role === 'USER' ? 'Our Menu Items' : 'Special menu all items'}
              </h2>
              {user?.role === 'ADMIN' && (
                <button 
                  onClick={handleAddMenuItem}
                  style={{
                    background: colors.accent,
                    color: '#333',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#E8A8C8'}
                  onMouseLeave={(e) => e.target.style.background = colors.accent}
                >
                  Add Menu Item
                </button>
              )}
            </div>

            {/* Menu Type Tabs */}
            <div style={{ 
              display: 'flex', 
              gap: 0, 
              marginBottom: 10,
              borderBottom: `1px solid ${colors.line}`,
              marginLeft: 0,
              marginRight: 0
            }}>
              {menuTypes.map((menuType) => (
                <button
                  key={menuType.id}
                  onClick={() => handleMenuTypeClick(menuType.id)}
                  style={{
                    background: 'transparent',
                    color: activeMenuType === menuType.id ? colors.accent : colors.muted,
                    border: 'none',
                    padding: '12px 24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderBottom: activeMenuType === menuType.id ? `2px solid ${colors.accent}` : '2px solid transparent',
                    fontWeight: activeMenuType === menuType.id ? 500 : 400
                  }}
                  onMouseEnter={(e) => {
                    if (activeMenuType !== menuType.id) {
                      e.target.style.color = colors.text
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeMenuType !== menuType.id) {
                      e.target.style.color = colors.muted
                    }
                  }}
                >
                  {menuType.name}
                </button>
              ))}
            </div>

            {/* Menu Items Table */}
            <div style={{ 
              background: colors.panel, 
              borderRadius: 10, 
              overflow: 'hidden',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 10,
              marginLeft: 0,
              marginRight: 0
            }}>
              {/* Table Header */}
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                background: colors.panel,
                borderBottom: `1px solid ${colors.line}`,
                overflow: 'hidden'
              }}>
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredMenuItems.length && filteredMenuItems.length > 0}
                  onChange={handleSelectAll}
                  style={{ 
                    marginRight: 16,
                    width: 16,
                    height: 16,
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                />
                <div style={{ width: 80, fontWeight: 500, fontSize: 14, color: colors.text, flexShrink: 0 }}>Product</div>
                <div style={{ width: 250, fontWeight: 500, fontSize: 14, color: colors.text, flexShrink: 0 }}>Product Name</div>
                <div style={{ width: 180, fontWeight: 500, fontSize: 14, color: colors.text, flexShrink: 0 }}>Item ID</div>
                <div style={{ width: 100, fontWeight: 500, fontSize: 14, color: colors.text, flexShrink: 0 }}>Stock</div>
                <div style={{ width: 120, fontWeight: 500, fontSize: 14, color: colors.text, flexShrink: 0 }}>Category</div>
                <div style={{ width: 100, fontWeight: 500, fontSize: 14, color: colors.text, flexShrink: 0 }}>Price</div>
                <div style={{ width: 120, fontWeight: 500, fontSize: 14, color: colors.text, flexShrink: 0 }}>Availability</div>
                <div style={{ width: 120, fontWeight: 500, fontSize: 14, color: colors.text, textAlign: 'center', flexShrink: 0 }}>Actions</div>
              </div>

              {/* Table Rows */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                overflowY: 'auto',
                flex: 1
              }}>
                {filteredMenuItems.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 20px',
                      background: index % 2 === 0 ? colors.panel : '#2A2D2E',
                      borderBottom: index < filteredMenuItems.length - 1 ? `1px solid ${colors.line}` : 'none',
                      overflow: 'hidden'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleItemSelect(item.id)}
                      style={{ 
                        marginRight: 16,
                        width: 16,
                        height: 16,
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    />
                    
                    {/* Product Image */}
                    <div style={{ 
                      width: 50, 
                      height: 50, 
                      background: '#333333', 
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 16,
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0
                    }}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        loading="lazy"
                        key={`${item.id}-${item.image}`}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          borderRadius: '6px'
                        }}
                        onError={(e) => {
                          console.log(`Image failed to load for ${item.name}: ${item.image}`);
                          // Fallback to placeholder if image fails to load
                          e.target.src = '/placeholder-food.jpg';
                        }}
                        onLoad={() => {
                          console.log(`Image loaded successfully for ${item.name}: ${item.image}`);
                        }}
                      />
                    </div>
                    
                    {/* Product Name */}
                    <div style={{ width: 250, marginRight: 16, flexShrink: 0 }}>
                        <div>
                          <div style={{ 
                            fontWeight: 500, 
                            fontSize: 14, 
                            color: colors.text,
                            marginBottom: 4
                          }}>
                            {item.name}
                          </div>
                          <div style={{ 
                            fontSize: 12, 
                            color: colors.muted,
                            lineHeight: 1.4
                          }}>
                            {item.description}
                          </div>
                        </div>
                    </div>
                    
                    {/* Item ID */}
                    <div style={{ 
                      width: 180, 
                      fontSize: 14, 
                      color: colors.text,
                      marginRight: 16,
                      flexShrink: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.id}
                    </div>
                    
                    {/* Stock */}
                    <div style={{ 
                      width: 100, 
                      fontSize: 14, 
                      color: colors.text,
                      marginRight: 16,
                      flexShrink: 0
                    }}>
                      {`${item.stock || 0} items`}
                    </div>
                    
                    {/* Category */}
                    <div style={{ 
                      width: 120, 
                      fontSize: 14, 
                      color: colors.text,
                      marginRight: 16,
                      flexShrink: 0
                    }}>
                      {item.category}
                    </div>
                    
                    {/* Price */}
                    <div style={{ 
                      width: 100, 
                      fontSize: 14, 
                      color: colors.text,
                      marginRight: 16,
                      flexShrink: 0
                    }}>
                      {item.price}
                    </div>
                    
                    {/* Availability */}
                    <div style={{ 
                      width: 120, 
                      fontSize: 14, 
                      color: item.availability === 'In Stock' ? '#4CAF50' : '#F44336',
                      marginRight: 16,
                      flexShrink: 0
                    }}>
                      {item.availability}
                    </div>
                    
                    {/* Actions */}
                    {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
                      <div style={{ 
                        width: 120, 
                        display: 'flex', 
                        gap: 8, 
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                            <button
                              onClick={() => handleEditItem(item.id)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: colors.accent,
                                cursor: 'pointer',
                                padding: 8,
                                borderRadius: 6,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#3D4142'}
                              onMouseLeave={(e) => e.target.style.background = 'transparent'}
                            >
                              <FiEdit3 size={16} />
                            </button>
                        {/* Only show delete button for ADMIN, not for STAFF */}
                        {user?.role === 'ADMIN' && (
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#F44336',
                                cursor: 'pointer',
                                padding: 8,
                                borderRadius: 6,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#3D4142'}
                              onMouseLeave={(e) => e.target.style.background = 'transparent'}
                            >
                              <FiTrash2 size={16} />
                            </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && user?.role === 'ADMIN' && (
        <div 
          onClick={handleBackdropClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease-out',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'flex-end',
            zIndex: 1000
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: colors.panel,
              borderRadius: 0,
              padding: 24,
              width: 400,
              height: '100vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                color: colors.text,
                margin: 0
              }}>
                Add New Category
              </h3>
              <button
                onClick={handleCloseModals}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: colors.text,
                  cursor: 'pointer',
                  fontSize: 20,
                  padding: 4
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: 8
            }}>
            {/* Category Image Upload */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 8
              }}>
                Category Image
              </label>
              <div 
                onClick={() => document.getElementById('newCategoryImageInput').click()}
                style={{
                  width: 80,
                  height: 80,
                  background: colors.inputBg,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #666',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {categoryImagePreview ? (
                  <img 
                    src={categoryImagePreview} 
                    alt="Category preview"
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <span style={{ color: '#666', fontSize: 12 }}>Click to upload</span>
                )}
              </div>
              <input
                id="newCategoryImageInput"
                type="file"
                accept="image/*"
                onChange={handleCategoryImageChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Category Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 8
              }}>
                Category Name
              </label>
              <input
                type="text"
                placeholder="Enter Category name"
                value={newCategoryForm.name}
                onChange={(e) => setNewCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: colors.inputBg,
                  border: '1px solid #3D4142',
                  borderRadius: 8,
                  color: colors.text,
                  fontSize: 14
                }}
              />
            </div>

            </div>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCloseModals}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid #3D4142',
                  borderRadius: 8,
                  color: colors.text,
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategorySubmit}
                style={{
                  padding: '10px 20px',
                  background: colors.accent,
                  border: 'none',
                  borderRadius: 8,
                  color: '#333',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Icon Modal (Edit New Category) */}
      {isEditIconModalOpen && editingCategory && (user?.role === 'ADMIN' || user?.role === 'STAFF') && (
        <div 
          onClick={handleBackdropClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease-out',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'flex-end',
            zIndex: 1000
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: colors.panel,
              borderRadius: 0,
              padding: 24,
              width: 400,
              height: '100vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                color: colors.text,
                margin: 0
              }}>
                Edit New Category
              </h3>
              <button
                onClick={handleCloseModals}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: colors.text,
                  cursor: 'pointer',
                  fontSize: 20,
                  padding: 4
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: 8
            }}>
            {/* Icon Display */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 8
              }}>
                Category Icon
              </label>
              <div style={{
                width: 80,
                height: 80,
                background: '#333333',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8
              }}>
                {(() => {
                  const currentIconData = AVAILABLE_ICONS[editIconForm.iconIndex];
                  const IconComponent = currentIconData.component;
                  return <IconComponent />;
                })()}
              </div>
              <button 
                onClick={() => {
                  // Cycle through available icons using index
                  const nextIndex = (editIconForm.iconIndex + 1) % AVAILABLE_ICONS.length;
                  setEditIconForm(prev => ({ ...prev, iconIndex: nextIndex }));
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: colors.accent,
                  fontSize: 12,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}>
                Change Icon
              </button>
            </div>

            {/* Category Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 8
              }}>
                Category Name
              </label>
              <input
                type="text"
                value={editIconForm.name}
                onChange={(e) => setEditIconForm(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: colors.inputBg,
                  border: '1px solid #3D4142',
                  borderRadius: 8,
                  color: colors.text,
                  fontSize: 14
                }}
              />
            </div>

            {/* Select Menu */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 8
              }}>
                Select Menu
              </label>
              <select 
                value={editIconForm.menu}
                onChange={(e) => setEditIconForm(prev => ({ ...prev, menu: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: colors.inputBg,
                  border: '1px solid #3D4142',
                  borderRadius: 8,
                  color: colors.text,
                  fontSize: 14
                }}>
                <option>Fajita</option>
                <option>Normal Menu</option>
                <option>Special Deals</option>
                <option>New Year Special</option>
                <option>Deserts and Drinks</option>
              </select>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 8
              }}>
                Description
              </label>
              <textarea
                value={editIconForm.description}
                onChange={(e) => setEditIconForm(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="Enter category description"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: colors.inputBg,
                  border: '1px solid #3D4142',
                  borderRadius: 8,
                  color: colors.text,
                  fontSize: 14,
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCloseModals}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid #3D4142',
                  borderRadius: 8,
                  color: colors.text,
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleEditIconSave}
                style={{
                  padding: '10px 20px',
                  background: colors.accent,
                  border: 'none',
                  borderRadius: 8,
                  color: '#333',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                Save Changes
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Menu Item Modal */}
      {isEditMenuItemModalOpen && (user?.role === 'ADMIN' || user?.role === 'STAFF') && (
        <div 
          onClick={handleBackdropClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease-out',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'flex-end',
            zIndex: 1000
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: colors.panel,
              borderRadius: 0,
              padding: 24,
              width: 400,
              height: '100vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                color: colors.text,
                margin: 0
              }}>
                Edit Menu Item
              </h3>
              <button
                onClick={handleCloseModals}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: colors.text,
                  cursor: 'pointer',
                  fontSize: 20,
                  padding: 4
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{
              flex: 1,
              paddingRight: 8
            }}>
            {/* Product Image */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 4
              }}>
                Product Image
              </label>
              <div 
                onClick={() => document.getElementById('editImageInput').click()}
                style={{
                  width: 80,
                  height: 80,
                  background: colors.inputBg,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #666',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {(() => {
                  // Show preview if new image is selected
                  if (editImagePreview) {
                    return (
                      <img 
                        src={editImagePreview} 
                        alt="Preview"
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 4
                        }}
                      />
                    );
                  }
                  
                  // Show current image if no new image selected
                  const currentItem = menuItemsData.find(item => item.id === editingItem);
                  if (currentItem && currentItem.image) {
                    return (
                      <img 
                        src={currentItem.image} 
                        alt={currentItem.name}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 4
                        }}
                        onError={(e) => {
                          e.target.src = '/placeholder-food.jpg';
                        }}
                      />
                    );
                  }
                  return null;
                })()}
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  color: '#666',
                  fontSize: 10
                }}>
                  <span>Upload</span>
                </div>
              </div>
              <input
                type="file"
                id="editImageInput"
                accept="image/*"
                onChange={handleEditImageChange}
                style={{ display: 'none' }}
              />
              <button 
                onClick={() => document.getElementById('editImageInput').click()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: colors.accent,
                  fontSize: 10,
                  cursor: 'pointer',
                  marginTop: 2,
                  textDecoration: 'underline'
                }}
              >
                {editImageFile ? 'Change Image' : 'Change'}
              </button>
            </div>

            {/* Product Name */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 4
              }}>
                Product Name
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: colors.inputBg,
                  border: '1px solid #3D4142',
                  borderRadius: 6,
                  color: colors.text,
                  fontSize: 12
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 4
              }}>
                Description
              </label>
              <textarea
                placeholder="Enter product description"
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: colors.inputBg,
                  border: '1px solid #3D4142',
                  borderRadius: 6,
                  color: colors.text,
                  fontSize: 12,
                  resize: 'none'
                }}
              />
            </div>

            {/* Price */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 4
              }}>
                Price
              </label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                value={editFormData.price || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, price: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: colors.inputBg,
                  border: '1px solid #3D4142',
                  borderRadius: 6,
                  color: colors.text,
                  fontSize: 12
                }}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 4
              }}>
                Category
              </label>
              <select 
                value={editFormData.category || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, category: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: colors.inputBg,
                  border: '1px solid #3D4142',
                  borderRadius: 6,
                  color: colors.text,
                  fontSize: 12
                }}
              >
                <option value="">Select category</option>
                {categoriesData.filter(cat => cat.id !== 'all').map(cat => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 4
              }}>
                Stock Quantity
              </label>
              <input
                type="number"
                placeholder="0"
                value={editFormData.stock || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, stock: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: colors.inputBg,
                  border: '1px solid #3D4142',
                  borderRadius: 6,
                  color: colors.text,
                  fontSize: 12
                }}
              />
            </div>

            {/* Availability */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 4
              }}>
                Availability
              </label>
              <select 
                value={editFormData.availability || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, availability: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: colors.inputBg,
                  border: '1px solid #3D4142',
                  borderRadius: 6,
                  color: colors.text,
                  fontSize: 12
                }}
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCancelEdit}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid #3D4142',
                  borderRadius: 8,
                  color: colors.text,
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                style={{
                  padding: '10px 20px',
                  background: colors.accent,
                  border: 'none',
                  borderRadius: 8,
                  color: '#333',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                Save Changes
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Menu Item Modal */}
      {isAddMenuItemModalOpen && user?.role === 'ADMIN' && (
        <div 
          onClick={handleBackdropClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease-out',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'flex-end',
            zIndex: 1000
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: colors.panel,
              borderRadius: 0,
              padding: 24,
              width: 400,
              height: '100vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                color: colors.text,
                margin: 0
              }}>
                Add New Menu Item
              </h3>
              <button
                onClick={handleCloseModals}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: colors.text,
                  cursor: 'pointer',
                  fontSize: 20,
                  padding: 4
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{
              flex: 1,
              paddingRight: 8
            }}>
            {/* Product Image */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 4
              }}>
                Product Image
              </label>
              <div 
                onClick={() => document.getElementById('addImageInput').click()}
                style={{
                  width: 80,
                  height: 80,
                  background: colors.inputBg,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #666',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                {addImagePreview ? (
                  <img 
                    src={addImagePreview} 
                    alt="Preview"
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 4
                    }}
                  />
                ) : (
                  <span style={{ color: '#666', fontSize: 10 }}>Upload</span>
                )}
              </div>
              <input
                id="addImageInput"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setAddImageFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setAddImagePreview(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                style={{ display: 'none' }}
                aria-label="Upload product image"
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button 
                  onClick={() => document.getElementById('addImageInput').click()}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: colors.accent,
                    fontSize: 10,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}>
                  Change
                </button>
                {addImagePreview && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddImageFile(null);
                      setAddImagePreview(null);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ff4444',
                      fontSize: 10,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}>
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Product Name */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 4
              }}>
                Product Name
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                value={addMenuItemForm.name}
                onChange={(e) => setAddMenuItemForm(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: colors.inputBg,
                  border: '1px solid #3D4142',
                  borderRadius: 6,
                  color: colors.text,
                  fontSize: 12
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 4
              }}>
                Description
              </label>
              <textarea
                placeholder="Enter product description"
                value={addMenuItemForm.description}
                onChange={(e) => setAddMenuItemForm(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: colors.inputBg,
                  border: '1px solid #3D4142',
                  borderRadius: 6,
                  color: colors.text,
                  fontSize: 12,
                  resize: 'none'
                }}
              />
            </div>

            {/* Price */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 4
              }}>
                Price
              </label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                value={addMenuItemForm.price}
                onChange={(e) => setAddMenuItemForm(prev => ({ ...prev, price: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: colors.inputBg,
                  border: '1px solid #3D4142',
                  borderRadius: 6,
                  color: colors.text,
                  fontSize: 12
                }}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 4
              }}>
                Category
              </label>
              <select 
                value={addMenuItemForm.category}
                onChange={(e) => setAddMenuItemForm(prev => ({ ...prev, category: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: colors.inputBg,
                  border: '1px solid #3D4142',
                  borderRadius: 6,
                  color: colors.text,
                  fontSize: 12
                }}
              >
                <option value="">Select category</option>
                {categoriesData.filter(cat => cat.id !== 'all').map(cat => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 4
              }}>
                Stock Quantity
              </label>
              <input
                type="number"
                placeholder="0"
                value={addMenuItemForm.stock}
                onChange={(e) => setAddMenuItemForm(prev => ({ ...prev, stock: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: colors.inputBg,
                  border: '1px solid #3D4142',
                  borderRadius: 6,
                  color: colors.text,
                  fontSize: 12
                }}
              />
            </div>

            {/* Availability */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 4
              }}>
                Availability
              </label>
              <select 
                value={addMenuItemForm.availability}
                onChange={(e) => setAddMenuItemForm(prev => ({ ...prev, availability: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: colors.inputBg,
                  border: '1px solid #3D4142',
                  borderRadius: 6,
                  color: colors.text,
                  fontSize: 12
                }}
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCloseModals}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid #3D4142',
                  borderRadius: 8,
                  color: colors.text,
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddMenuItemSubmit}
                style={{
                  padding: '10px 20px',
                  background: colors.accent,
                  border: 'none',
                  borderRadius: 8,
                  color: '#333',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                Add Item
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditCategoryModalOpen && (user?.role === 'ADMIN' || user?.role === 'STAFF') && (
        <div 
          onClick={handleBackdropClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.3s ease-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: colors.panel,
              borderRadius: '20px',
              padding: 0,
              width: '100%',
              maxWidth: '700px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6)',
              border: `1px solid ${colors.line}`,
              overflow: 'hidden',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(250, 193, 217, 0.1) 0%, rgba(250, 193, 217, 0.05) 100%)',
              padding: '24px 32px',
              borderBottom: `1px solid ${colors.line}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: colors.text,
                  margin: 0,
                  letterSpacing: '-0.5px'
                }}>
                  {editingCategoryData ? 'Edit Category' : 'Manage Categories'}
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: colors.muted,
                  margin: '4px 0 0 0'
                }}>
                  {editingCategoryData ? 'Update category details' : 'Organize your menu categories'}
                </p>
              </div>
              <button
                onClick={handleCloseModals}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: colors.text,
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '12px',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)'
                  e.target.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                  e.target.style.transform = 'scale(1)'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Modal Content */}
            <div style={{
              flex: 1,
              padding: '32px',
              overflowY: 'auto'
            }}>
              {editingCategoryData ? (
                // Individual category editing
                <>
                  {/* Category Name */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: colors.text,
                      marginBottom: 8
                    }}>
                      Category Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter category name"
                      value={editCategoryForm.name}
                      onChange={(e) => setEditCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: colors.inputBg,
                        border: `2px solid ${colors.line}`,
                        borderRadius: '12px',
                        color: colors.text,
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.accent
                        e.target.style.background = '#3D4142'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = colors.line
                        e.target.style.background = colors.inputBg
                      }}
                    />
                  </div>

                  {/* Category Image */}
                  <div style={{ marginBottom: 32 }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: colors.text,
                      marginBottom: 12
                    }}>
                      Category Image
                    </label>
                    <div 
                      onClick={() => document.getElementById('categoryImageInput').click()}
                      style={{
                        width: '120px',
                        height: '120px',
                        background: colors.inputBg,
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px dashed ${colors.line}`,
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = colors.accent
                        e.target.style.transform = 'scale(1.02)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = colors.line
                        e.target.style.transform = 'scale(1)'
                      }}
                    >
                      {categoryImagePreview ? (
                        <img 
                          src={categoryImagePreview} 
                          alt="Category preview"
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '14px'
                          }}
                        />
                      ) : (
                        <div style={{
                          color: colors.muted,
                          fontSize: '14px',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 8
                        }}>
                          <div style={{ fontSize: '24px' }}>📷</div>
                          <div>Click to upload</div>
                        </div>
                      )}
                    </div>
                    <input
                      id="categoryImageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryImageChange}
                      style={{ display: 'none' }}
                    />
                    <p style={{
                      fontSize: '12px',
                      color: colors.muted,
                      margin: '8px 0 0 0'
                    }}>
                      Recommended: 200x200px or larger
                    </p>
                  </div>
                </>
              ) : (
                // Bulk category management - show all categories
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12
                  }}>
                    <label style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: colors.text,
                      margin: 0
                    }}>
                      All Categories ({categoriesData.filter(cat => cat.id !== 'all').length})
                    </label>
                    <div style={{
                      fontSize: 12,
                      color: colors.muted,
                      background: 'rgba(255,255,255,0.05)',
                      padding: '4px 8px',
                      borderRadius: 6
                    }}>
                      Total Items: {categoriesData.reduce((sum, cat) => sum + (cat.count || 0), 0)}
                    </div>
                  </div>
                  <div style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    border: `1px solid ${colors.line}`,
                    borderRadius: 8,
                    padding: 12,
                    background: 'rgba(255,255,255,0.02)'
                  }}>
                    {categoriesData.filter(cat => cat.id !== 'all').length === 0 ? (
                      <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: colors.muted,
                        fontSize: 14
                      }}>
                        No categories found. Create your first category to get started.
                      </div>
                    ) : (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 12
                      }}>
                        {categoriesData.filter(cat => cat.id !== 'all').map((category) => (
                          <div key={category.id} style={{
                            background: colors.panel,
                            border: `1px solid ${colors.line}`,
                            borderRadius: 8,
                            padding: 16,
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = colors.accent
                            e.target.style.transform = 'translateY(-2px)'
                            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = colors.line
                            e.target.style.transform = 'translateY(0px)'
                            e.target.style.boxShadow = 'none'
                          }}
                          >
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              marginBottom: 12
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ 
                                  width: 40, 
                                  height: 40, 
                                  background: 'rgba(250, 193, 217, 0.1)',
                                  borderRadius: 8,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  {getCategoryIcon(category.name)}
                                </div>
                                <div>
                                  <div style={{ 
                                    fontSize: 14, 
                                    fontWeight: 600, 
                                    color: colors.text,
                                    marginBottom: 2
                                  }}>
                                    {category.name}
                                  </div>
                                  <div style={{ 
                                    fontSize: 12, 
                                    color: colors.muted
                                  }}>
                                    {category.count} items
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div style={{ 
                              display: 'flex', 
                              gap: 8,
                              justifyContent: 'flex-end'
                            }}>
                              <button
                                onClick={() => handleEditCategory(category)}
                                style={{
                                  background: colors.accent,
                                  border: 'none',
                                  color: '#333',
                                  cursor: 'pointer',
                                  padding: '8px 16px',
                                  borderRadius: 6,
                                  fontSize: 12,
                                  fontWeight: 500,
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#E8A8C8'}
                                onMouseLeave={(e) => e.target.style.background = colors.accent}
                              >
                                Edit Category
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id)}
                                style={{
                                  background: 'transparent',
                                  border: '1px solid #F44336',
                                  color: '#F44336',
                                  cursor: 'pointer',
                                  padding: '8px 16px',
                                  borderRadius: 6,
                                  fontSize: 12,
                                  fontWeight: 500,
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = '#F44336';
                                  e.target.style.color = '#FFFFFF';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = 'transparent';
                                  e.target.style.color = '#F44336';
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '24px 32px',
              borderTop: `1px solid ${colors.line}`,
              display: 'flex',
              gap: 16,
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCloseModals}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: `2px solid ${colors.line}`,
                  borderRadius: '12px',
                  color: colors.text,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = colors.accent
                  e.target.style.background = 'rgba(250, 193, 217, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = colors.line
                  e.target.style.background = 'transparent'
                }}
              >
                {editingCategoryData ? 'Cancel' : 'Close'}
              </button>
              {editingCategoryData && (
                <button
                  onClick={handleEditCategorySubmit}
                  style={{
                    padding: '12px 24px',
                    background: colors.accent,
                    border: 'none',
                    borderRadius: '12px',
                    color: '#000',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 15px rgba(250, 193, 217, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#E8A8C8'
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 20px rgba(250, 193, 217, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = colors.accent
                    e.target.style.transform = 'translateY(0px)'
                    e.target.style.boxShadow = '0 4px 15px rgba(250, 193, 217, 0.3)'
                  }}
                >
                  Update Category
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
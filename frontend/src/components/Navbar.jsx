import React, { useContext } from "react";
import {
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useColorMode,
  Input,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuDivider,
  MenuItem,
  Checkbox,
  Select,
  useToast,
  useColorModeValue,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { PlusSquareIcon, CheckIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { FaCog, FaUser } from "react-icons/fa";

// Import your context & the ChangelogDropdown
import { useInventorySettings } from "../context/InventorySettingsContext";
import ChangeLogDropdown from "./ChangeLogDropdown";

// NEW: import AuthContext
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  // choose email text color based on light/dark mode
  const emailColor = useColorModeValue("black", "white");

  // NEW: pull user + logout
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Inventory settings from context
  const {
    showLowStockOnly,
    setShowLowStockOnly,
    sortOrder,
    setSortOrder,
    lowStockThreshold,
    setLowStockThreshold,
    saveLowStockThreshold,
  } = useInventorySettings();

  // Helper to confirm threshold
  const confirmThresholdChange = (e) => {
    e.stopPropagation();
    toast({
      title: "Threshold updated",
      description: `Low stock threshold is now ${lowStockThreshold}`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // NEW: logout handler
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container maxW={"1140px"} px={4}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{ base: "column", sm: "row" }}
      >
        {/* --- App Title --- */}
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient={"linear(to-r, cyan.400, blue.500)"}
          bgClip={"text"}
        >
          <Link to={"/"}> ✨ Fizzlestick's Stock Tracker 3000 🔮✨ </Link>
        </Text>

        {/* --- Right side icons: create, color mode, settings, changelog, user --- */}
        <HStack spacing={2} alignItems={"center"}>
          {/* Create new product button */}
          <Button
            onClick={() => {
              if (!user) {
                toast({
                  title: "Unauthorized",
                  description: "You must be logged in to create a product.",
                  status: "warning",
                  duration: 3000,
                  isClosable: true,
                });
              } else {
                navigate("/create");
              }
            }}
          >
            <PlusSquareIcon fontSize={20} />
          </Button>

          {/* Toggle light/dark mode */}
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <IoMoon /> : <LuSun size="20" />}
          </Button>

          {/* Gear icon: Inventory Settings */}
          <Menu closeOnSelect={false}>
            <MenuButton as={Button}>
              <FaCog />
            </MenuButton>
            <MenuList>
              <MenuGroup>
                {/* Inventory Settings Title */}
                <Text fontSize="lg" fontWeight="bold" px={4} py={2}>
                  Inventory Settings
                </Text>

                {/* 1. Low Stock Threshold */}
                <MenuItem
                  onClick={(e) => e.stopPropagation()}
                  _hover={{ bg: "transparent" }}
                  _focus={{ bg: "transparent" }}
                  _active={{ bg: "transparent" }}
                  tabIndex={-1}
                >
                  <VStack spacing={2} w="full">
                    <Text fontSize="md" alignSelf="flex-start">
                      Low Stock Threshold
                    </Text>
                    <Flex gap={2} w="full">
                      <Input
                        placeholder="Threshold"
                        type="number"
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        width="full"
                        bg="transparent"
                        _focus={{ bg: "transparent", boxShadow: "none" }}
                        _active={{ bg: "transparent" }}
                      />
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveLowStockThreshold(); // ✅ save to localStorage
                          toast({
                            title: "Threshold saved",
                            description: `Saved as ${lowStockThreshold}`,
                            status: "success",
                            duration: 2000,
                            isClosable: true,
                          });
                        }}
                        size="sm"
                        variant="outline"
                        h="38px"
                        minW="38px"
                        border="1px"
                        borderColor="black"
                        _hover={{ borderColor: "black", bg: "transparent" }}
                        _focus={{ borderColor: "black", boxShadow: "none" }}
                      >
                        <CheckIcon color="black" />
                      </Button>
                    </Flex>
                  </VStack>
                </MenuItem>

                <MenuDivider />

                {/* 2. Show low stock only */}
                <MenuItem
                  onClick={(e) => e.stopPropagation()}
                  _hover={{ bg: "transparent" }}
                  tabIndex={-1}
                >
                  <Checkbox
                    isChecked={showLowStockOnly}
                    onChange={(e) => setShowLowStockOnly(e.target.checked)}
                  >
                    Show low stock only
                  </Checkbox>
                </MenuItem>

                <MenuDivider />

                {/* 3. Sort Order Dropdown */}
                <MenuItem
                  onClick={(e) => e.stopPropagation()}
                  _hover={{ bg: "transparent" }}
                  tabIndex={-1}
                >
                  <Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    width="full"
                  >
                    <option value="lowToHigh">
                      Sort by Quantity: Low → High
                    </option>
                    <option value="highToLow">
                      Sort by Quantity: High → Low
                    </option>
                  </Select>
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>

          {/* Changelog icon */}
          <ChangeLogDropdown />

          {/* NEW: User icon menu */}
          {user ? (
            <Menu>
              <MenuButton as={Button}>
                <FaUser />
              </MenuButton>
              <MenuList>
                {/* email text now black in light / white in dark */}
                <MenuItem
                  isDisabled
                  color={emailColor}
                  _disabled={{ color: emailColor, opacity: 1 }}
                >
                  {user.email}
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  onClick={handleLogout}
                  bg="transparent"
                  _hover={{ bg: "gray.600", color: "white" }}
                  _active={{ bg: "transparent" }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button as={Link} to="/login" fontWeight="medium">
              Login
            </Button>
          )}
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;

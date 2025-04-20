import React, { useEffect, useState, useContext } from "react";
import {
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Text,
} from "@chakra-ui/react";
import { FaRegClock } from "react-icons/fa6";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
// import inventory settings context
import { useInventorySettings } from "../context/InventorySettingsContext";

function ChangeLogDropdown() {
  const { token } = useContext(AuthContext);
  const { preferredCurrency } = useInventorySettings();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    // Define a function to fetch the logs
    const fetchLogs = () => {
      axios
        .get("/api/logs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (isMounted) {
            setLogs(res.data);
          }
        })
        .catch((err) => console.error("Error fetching logs:", err));
    };

    fetchLogs();

    const intervalId = setInterval(fetchLogs, 5000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [token]);

  return (
    <Flex align="center" gap={2}>
      <Menu>
        {/* Clock icon button now uses a regular Button for consistency */}
        <MenuButton as={Button} aria-label="Changelog">
          <FaRegClock />
        </MenuButton>
        <MenuList>
          <Box px={3} py={2}>
            <Text fontWeight="bold">Recent Inventory Changes</Text>
          </Box>

          {logs.slice(0, 5).map((log) => {
            const date = new Date(log.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            });

            let changeText;

            // Handle name change
            if (log.action === "renamed") {
              changeText = `was ${log.oldValue}, renamed → now ${log.newValue}`;

            // Handle price change
            } else if (log.action === "new price") {
              changeText = `${log.itemName} was ${log.oldValue} ${preferredCurrency}, new price → now ${log.newValue} ${preferredCurrency}`;

            // Determine quantity-related changes: created, deleted, restocked, or sold
            } else {
              const before = log.previousQuantity;
              const after = log.newQuantity;

              if (log.action === "created") {
                changeText = `created (was 0 items → now ${after} items)`;
              } else if (log.action === "deleted" || after === 0) {
                changeText = `deleted (was ${before} items → now 0 items)`;
              } else if (log.action === "restocked" || after > before) {
                const added = after - before;
                changeText = `was ${before} items, ${added} restocked → now ${after} items`;
              } else {
                const sold = before - after;
                changeText = `was ${before} items, ${sold} sold → now ${after} items`;
              }
            }

            // Decide display text: omit itemName for name/price changes
            const displayText =
              log.action === "renamed" || log.action === "new price"
                ? changeText
                : `${log.itemName} ${changeText}`;

            return (
              <MenuItem
                key={log._id}
                _hover={{ bg: "transparent" }}
                _focus={{ bg: "transparent" }}
                _active={{ bg: "transparent" }}
              >
                🕒 {date} – {displayText}
              </MenuItem>
            );
          })}

          <MenuItem
            as="a"
            href="/changelog"
            _hover={{ bg: "gray.600", color: "white" }}
          >
            View Full History →
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}

export default ChangeLogDropdown;

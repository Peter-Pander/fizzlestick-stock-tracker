import React, { useEffect, useState } from "react";
import { Flex, IconButton, Menu, MenuButton, MenuList, MenuItem, Box, Text } from "@chakra-ui/react";
// Import a different icon (EditIcon) so we don't have two gears
import { EditIcon } from "@chakra-ui/icons";
import axios from "axios";

function ChangeLogDropdown() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get("/api/logs")
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Error fetching logs:", err));
  }, []);

  return (
    <Flex align="center" gap={2}>
      {/* No gear icon here; use EditIcon (or any icon you like) */}
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<EditIcon />}     // <--- Replace gear with EditIcon
          aria-label="Changelog"
        />
        <MenuList>
          <Box px={3} py={2}>
            <Text fontWeight="bold">Recent Changes</Text>
          </Box>

          {logs.slice(0, 5).map((log) => {
            const date = new Date(log.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            });
            const changeText =
              log.previousQuantity === 0
                ? `restocked: 0 → ${log.newQuantity}`
                : `${log.previousQuantity} → ${log.newQuantity}`;

            return (
              <MenuItem key={log._id}>
                🕒 {date} – {log.itemName} {changeText}
              </MenuItem>
            );
          })}

          <MenuItem as="a" href="/changelog">
            See full changelog →
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}

export default ChangeLogDropdown;

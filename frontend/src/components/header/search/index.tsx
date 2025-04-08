import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Avatar, Flex, Input, Typography } from "antd";
import { useList, useNavigation } from "@refinedev/core";
import { Link } from "react-router-dom";
import { API_URL } from "@/utils/constants";
import { getRandomColorFromString } from "@/utils/get-random-color";
import type { Account, Client } from "@/types";
import { useStyles } from "./styled";

type Option =
  | (Account & {
      resource: "accounts";
    })
  | (Client & {
      resource: "clients";
    });

export const Search = () => {
  const [searchText, setSearchText] = useState<string>("");

  const { styles } = useStyles();

  const { editUrl } = useNavigation();

  const { data: dataAccount } = useList<Account>({
    resource: "accounts",
    pagination: {
      current: 1,
      pageSize: 999,
    },
    filters: [
      {
        field: "account_name",
        operator: "contains",
        value: searchText,
      },
    ],
    meta: {
      populate: ["logo"],
    },
  });
  const accounts =
    dataAccount?.data?.map((account) => ({
      ...account,
      resource: "accounts",
    })) || [];

  const { data: dataClient } = useList<Client>({
    resource: "clients",
    pagination: {
      current: 1,
      pageSize: 999,
    },
    filters: [
      {
        field: "client_name",
        operator: "contains",
        value: searchText,
      },
    ],
  });
  const clients =
    dataClient?.data?.map((client) => ({
      ...client,
      resource: "clients",
    })) || [];

  const options = [...accounts, ...clients];

  return (
    <AutoComplete
      style={{
        width: "100%",
        maxWidth: "360px",
      }}
      filterOption={false}
      options={options}
      value={searchText}
      onChange={(text) => setSearchText(text)}
      optionRender={(option) => {
        const data = option.data as Option;

        let title = "";
        let to = "";
        let imageSrc = undefined;

        if (data.resource === "accounts") {
          if (data?.logo) {
            imageSrc = `${API_URL}${data.logo}`;
          }
          to = editUrl(data.resource, data.id);
          title = data.account_name;
        }

        if (data.resource === "clients") {
          title = data.client_name;
          to = editUrl(data.resource, data.id);
        }

        return (
          <Link to={to}>
            <Flex align="center" gap={8}>
              {data.resource === "accounts" && (
                <Avatar
                  shape="square"
                  size={24}
                  src={imageSrc}
                  alt={data.account_name}
                  style={{
                    backgroundColor: getRandomColorFromString(
                      data.account_name
                    ),
                  }}
                >
                  <Typography.Text>
                    {data.account_name?.[0]?.toUpperCase()}
                  </Typography.Text>
                </Avatar>
              )}
              <Typography.Text>{title}</Typography.Text>
            </Flex>
          </Link>
        );
      }}
    >
      <Input
        size="middle"
        placeholder="Search"
        suffix={<div className={styles.inputSuffix}>/</div>}
        prefix={<SearchOutlined className={styles.inputPrefix} />}
      />
    </AutoComplete>
  );
};

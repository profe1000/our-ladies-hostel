import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Input, List, message, Segmented, Space, Tag, Typography } from "antd";
import { getSaasMessages, setSaasMessageHandled } from "../../../apiservice/saas-ApiService";
import { getApiErrorMessage } from "../../../apiservice/public-ApiService";
import { formatDate } from "./saasAdminTheme";

const PAGE_SIZE = 20;
type Filter = "open" | "handled" | "all";

/** Messages sent from the public Contact us page */
const SaasMessages = () => {
  const [filter, setFilter] = useState<Filter>("open");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getSaasMessages({
      page,
      pageSize: PAGE_SIZE,
      search,
      handled: filter === "all" ? undefined : filter === "handled",
    })
      .then((result) => {
        setRows(result.data);
        setTotal(result.meta.total);
      })
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [page, search, filter]);

  useEffect(load, [load]);

  const toggle = async (item: any) => {
    try {
      await setSaasMessageHandled(item.id, !item.handledAt);
      load();
    } catch (e: any) {
      message.error(getApiErrorMessage(e));
    }
  };

  return (
    <>
      <div className="saasAdminPageHeader">
        <Typography.Title level={3}>Messages</Typography.Title>
      </div>

      <div className="saasAdminToolbar">
        <Segmented
          value={filter}
          onChange={(value) => {
            setFilter(value as Filter);
            setPage(1);
          }}
          options={[
            { value: "open", label: "To handle" },
            { value: "handled", label: "Handled" },
            { value: "all", label: "All" },
          ]}
        />
        <Input.Search
          placeholder="Name, email, estate or text"
          allowClear
          onSearch={(value) => {
            setSearch(value.trim());
            setPage(1);
          }}
          style={{ maxWidth: 320 }}
        />
      </div>

      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={rows}
        locale={{ emptyText: filter === "open" ? "Nothing to handle" : "No messages" }}
        pagination={
          total > PAGE_SIZE ? { current: page, pageSize: PAGE_SIZE, total, onChange: setPage, showSizeChanger: false } : false
        }
        renderItem={(item: any) => (
          <List.Item
            key={item.id}
            style={{ background: "#ffffff", borderRadius: 12, padding: 16, marginBottom: 12, border: "1px solid #f0f0f0" }}
            actions={[
              <a key="reply" href={`mailto:${item.email}?subject=${encodeURIComponent("Re: your message")}`}>
                Reply by email
              </a>,
              <Button key="toggle" size="small" type={item.handledAt ? "default" : "primary"} onClick={() => toggle(item)}>
                {item.handledAt ? "Mark as not handled" : "Mark as handled"}
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <Space wrap>
                  {item.name}
                  {item.estateName && <Tag>{item.estateName}</Tag>}
                  {item.handledAt && (
                    <Tag color="green">
                      Handled {formatDate(item.handledAt)}
                      {item.handledBy ? ` by ${item.handledBy}` : ""}
                    </Tag>
                  )}
                </Space>
              }
              description={
                <Space wrap split="·">
                  <a href={`mailto:${item.email}`}>{item.email}</a>
                  {item.phoneNumber && <a href={`tel:${item.phoneNumber}`}>{item.phoneNumber}</a>}
                  {formatDate(item.dateCreated)}
                </Space>
              }
            />
            <p className="saasAdminMessage">{item.message}</p>
          </List.Item>
        )}
      />
    </>
  );
};

export default SaasMessages;

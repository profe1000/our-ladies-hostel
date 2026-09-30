import { useEffect, useRef, useState } from "react";
import { Button, message } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { adminGetEstateApi, adminSaveBrandingApi } from "../../../../apiservice/admin-General-ApiService";
import { getApiErrorMessage } from "../../../../apiservice/public-ApiService";
import { clearEstateBrandingCache } from "../../../../hooks/useEstateBranding";

type Slot = "logo" | "homeImage1" | "homeImage2" | "homeImage3";

const slots: { key: Slot; label: string; hint: string; fallback?: string }[] = [
  { key: "logo", label: "Logo", hint: "Shown at the top of every page. A PNG with a transparent background looks best." },
  { key: "homeImage1", label: "Home picture 1 (large)", hint: "The big picture on your home page", fallback: "/images/sample/sample1.jpeg" },
  { key: "homeImage2", label: "Home picture 2", hint: "Top small picture", fallback: "/images/sample/sample2.jpeg" },
  { key: "homeImage3", label: "Home picture 3", hint: "Bottom small picture", fallback: "/images/sample/sample3.jpeg" },
];

type SlotState = { url?: string | null; file?: File; preview?: string; remove?: boolean };

/** Logo and the three pictures on the estate's public home page */
const EstateBrandingForm = () => {
  const [state, setState] = useState<Record<Slot, SlotState>>({
    logo: {},
    homeImage1: {},
    homeImage2: {},
    homeImage3: {},
  });
  const [saving, setSaving] = useState(false);
  const fileInputs = useRef<Partial<Record<Slot, HTMLInputElement | null>>>({});

  const load = async () => {
    const result = await adminGetEstateApi();
    const estate = result?.data || {};
    setState({
      logo: { url: estate.logoUrl },
      homeImage1: { url: estate.homeImage1Url },
      homeImage2: { url: estate.homeImage2Url },
      homeImage3: { url: estate.homeImage3Url },
    });
  };

  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  const pick = (slot: Slot, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      message.error("Please choose an image");
      return;
    }
    setState((current) => ({ ...current, [slot]: { ...current[slot], file, preview: URL.createObjectURL(file), remove: false } }));
  };

  const remove = (slot: Slot) => {
    setState((current) => ({ ...current, [slot]: { url: current[slot].url, remove: true } }));
  };

  const changed = slots.some((slot) => state[slot.key].file || state[slot.key].remove);

  const save = async () => {
    const formData = new FormData();
    slots.forEach(({ key }) => {
      const slotState = state[key];
      if (slotState.file) formData.append(key, slotState.file);
      if (slotState.remove) formData.append(`remove${key[0].toUpperCase()}${key.slice(1)}`, "true");
    });

    setSaving(true);
    try {
      await adminSaveBrandingApi(formData);
      clearEstateBrandingCache();
      await load();
      message.success("Logo and pictures saved");
    } catch (e: any) {
      message.error(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="estateSettingsGrid">
      {slots.map(({ key, label, hint, fallback }) => {
        const slotState = state[key];
        const shown = slotState.preview || (slotState.remove ? null : slotState.url);
        return (
          <div className="estateSettingsImageSlot" key={key}>
            <div className={`estateSettingsImageBox ${key === "logo" ? "estateSettingsImageBoxLogo" : ""}`}>
              {shown ? (
                <img src={shown} alt={label} />
              ) : fallback ? (
                <img src={fallback} alt="" className="estateSettingsImageFallback" />
              ) : (
                <PictureOutlined style={{ fontSize: 28, opacity: 0.4 }} />
              )}
              {!shown && <span className="estateSettingsImageBadge">{fallback ? "Sample picture" : "No logo: your name is shown"}</span>}
            </div>
            <div className="estateSettingsImageLabel myfont3">{label}</div>
            <div className="estateSettingsHint">{hint}</div>
            <div className="estateSettingsImageActions">
              <Button size="small" onClick={() => fileInputs.current[key]?.click()}>
                {shown ? "Change" : "Choose image"}
              </Button>
              <input
                ref={(input) => (fileInputs.current[key] = input)}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  pick(key, e.target.files?.[0]);
                  // Lets the same file be picked again after removing it
                  e.target.value = "";
                }}
              />
              {shown && (
                <Button size="small" type="text" danger onClick={() => remove(key)}>
                  Remove
                </Button>
              )}
            </div>
          </div>
        );
      })}
      <div className="estateSettingsSave">
        <Button type="primary" onClick={save} loading={saving} disabled={!changed}>
          Save logo and pictures
        </Button>
      </div>
    </div>
  );
};

export default EstateBrandingForm;

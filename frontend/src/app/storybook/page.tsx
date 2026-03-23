"use client";

import { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Modal from "../../components/ui/Modal";
import Table from "../../components/ui/Table";
import Loader from "../../components/ui/Loader";

export default function StorybookPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const tableColumns = [
    { key: "pair", label: "Currency Pair" },
    { key: "rate", label: "Exchange Rate" },
    { key: "change", label: "24h Change" },
    { key: "volume", label: "Volume" },
  ];

  const tableData = [
    { pair: "EUR/USD", rate: "1.0842", change: "+0.15%", volume: "$5.2B" },
    { pair: "GBP/USD", rate: "1.2651", change: "-0.08%", volume: "$3.1B" },
    { pair: "USD/JPY", rate: "149.82", change: "+0.32%", volume: "$4.8B" },
    { pair: "USD/TRY", rate: "38.42", change: "+0.45%", volume: "$1.2B" },
    { pair: "BTC/USD", rate: "67,243", change: "-1.20%", volume: "$28.5B" },
  ];

  return (
    <div className="min-h-screen bg-surface-secondary p-10 space-y-12">
      <h1 className="text-3xl font-bold text-neutral-900">
        Exchange Platform - UI Components
      </h1>

      {/* BUTTONS */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-800">Buttons</h2>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-neutral-600">Variants</h3>
          <div className="flex gap-4 flex-wrap items-center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="outlined">Outlined</Button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-neutral-600">Sizes</h3>
          <div className="flex gap-4 flex-wrap items-center">
            <Button size="lg">Large</Button>
            <Button size="sm">Small</Button>
            <Button size="xs">Extra Small</Button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-neutral-600">Disabled</h3>
          <div className="flex gap-4 flex-wrap items-center">
            <Button disabled>Primary Disabled</Button>
            <Button variant="secondary" disabled>Secondary Disabled</Button>
            <Button variant="danger" disabled>Danger Disabled</Button>
            <Button variant="outlined" disabled>Outlined Disabled</Button>
          </div>
        </div>
      </section>

      {/* INPUTS */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-800">Inputs</h2>

        <div className="max-w-md space-y-4">
          <Input label="Email" placeholder="Enter your email" />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
          <Input
            label="With Error"
            placeholder="Invalid input"
            error="This field is required"
          />
          <Input
            label="Disabled"
            placeholder="Cannot edit"
            disabled
          />
        </div>
      </section>

      {/* TEXTAREAS */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-800">Textareas</h2>

        <div className="max-w-md space-y-4">
          <Textarea label="Notes" placeholder="Enter your notes..." />
          <Textarea
            label="With Error"
            placeholder="Invalid content"
            error="Content is too short"
          />
          <Textarea
            label="Disabled"
            placeholder="Cannot edit"
            disabled
          />
        </div>
      </section>

      {/* MODAL */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-800">Modal</h2>

        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm Exchange"
          footer={
            <>
              <Button variant="outlined" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setModalOpen(false)}>
                Confirm
              </Button>
            </>
          }
        >
          <p className="text-neutral-700">
            Are you sure you want to exchange <strong>1,000 USD</strong> to{" "}
            <strong>EUR</strong> at rate <strong>1.0842</strong>?
          </p>
        </Modal>
      </section>

      {/* TABLE */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-800">Table</h2>

        <Table columns={tableColumns} data={tableData} />
      </section>

      {/* LOADERS */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-800">Loaders</h2>

        <div className="flex gap-6 items-center">
          <div className="flex flex-col items-center gap-2">
            <Loader size="xs" />
            <span className="text-xs text-neutral-500">XS</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Loader size="sm" />
            <span className="text-xs text-neutral-500">SM</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Loader size="lg" />
            <span className="text-xs text-neutral-500">LG</span>
          </div>
        </div>
      </section>
    </div>
  );
}

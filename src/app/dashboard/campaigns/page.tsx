'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle
} from '@/components/ui/modal';
import { Label } from '@/components/ui/label';

interface Campaign {
  id: string;
  name: string;
  clicks: number;
  impressions: number;
  ctr: number;
  conversions: number;
  cost: number;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: '',
    clicks: 0,
    impressions: 0,
    ctr: 0,
    conversions: 0,
    cost: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  async function fetchCampaigns() {
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns?search=${search}`);
      const data = await res.json();
      setCampaigns(data.campaigns || []); // <-- fix here
    } catch (error) {
      console.error(error);
      setCampaigns([]); // optional fallback
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchCampaigns();
  }, [search]);

  function openCreateModal() {
    setFormData({
      name: '',
      clicks: 0,
      impressions: 0,
      ctr: 0,
      conversions: 0,
      cost: 0,
    });
    setEditingId(null);
    setModalOpen(true);
  }

  function openEditModal(campaign: Campaign) {
    setFormData(campaign);
    setEditingId(campaign.id);
    setModalOpen(true);
  }

  async function handleSave() {
    setLoading(true);
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/campaigns/${editingId}` : '/api/campaigns';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    try {
      const data = await res.json();
      console.log('Response data:', data);
    } catch {
      console.log('No JSON response');
    } finally {
      setLoading(false);
    }

    if (res.ok) {
      setModalOpen(false);
      fetchCampaigns();
    } else {
      alert(data?.error || 'Failed to save campaign');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchCampaigns();
    } else {
      alert('Failed to delete campaign');
    }
  }

  function exportToCSV() {
    if (!campaigns.length) return;
    const headers = Object.keys(campaigns[0]);
    const csvRows = [
      headers.join(','), // header row
      ...campaigns.map((row) =>
        headers.map((field) => JSON.stringify(row[field] ?? '')).join(',')
      ),
    ];
    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaigns.csv';
    a.click();
    URL.revokeObjectURL(url);
  }


  function exportToPDF() {
  const doc = new jsPDF({ orientation: 'landscape' });
  if (!campaigns.length) return;
  const columns = Object.keys(campaigns[0]);
  const data = campaigns.map(row => columns.map(field => String(row[field] ?? '')));

  autoTable(doc, {
    head: [columns],
    body: data,
    theme: 'grid',
    tableWidth: 'wrap',
  });
  doc.save('campaigns.pdf');
}


  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <div className="flex w-95 justify-between">
          <Button   onClick={openCreateModal}>New Campaign</Button>
          <Button onClick={exportToCSV}>Export CSV</Button>
          <Button onClick={exportToPDF}>Export PDF</Button>
        </div>
      </div>

      <Input
        type="search"
        placeholder="Search campaigns..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 max-w-xs"
      />

      {loading ? (
        <p>Loading campaigns...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Impressions</TableHead>
              <TableHead>CTR (%)</TableHead>
              <TableHead>Conversions</TableHead>
              <TableHead>Cost ($)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No campaigns found.
                </td>
              </tr>
            ) : (
              campaigns.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.clicks}</TableCell>
                  <TableCell>{c.impressions}</TableCell>
                  <TableCell>{c.ctr.toFixed(2)}</TableCell>
                  <TableCell>{c.conversions}</TableCell>
                  <TableCell>{c.cost}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(c)}
                    >
                      Edit
                    </Button>{' '}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Modal */}
      {modalOpen && (
        <Modal open={modalOpen} onOpenChange={setModalOpen}>
          <ModalContent>
            
            <ModalHeader>
                <ModalTitle>{editingId ? 'Edit Campaign' : 'New Campaign'}</ModalTitle>
              
            </ModalHeader>
            <ModalBody className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="clicks">Clicks</Label>
                <Input
                  id="clicks"
                  type="number"
                  value={formData.clicks || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, clicks: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="impressions">Impressions</Label>
                <Input
                  id="impressions"
                  type="number"
                  value={formData.impressions || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      impressions: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ctr">CTR (%)</Label>
                <Input
                  id="ctr"
                  type="number"
                  step="0.01"
                  value={formData.ctr || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, ctr: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="conversions">Conversions</Label>
                <Input
                  id="conversions"
                  type="number"
                  value={formData.conversions || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      conversions: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="cost">Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: Number(e.target.value) })
                  }
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </MainLayout>
  );
}

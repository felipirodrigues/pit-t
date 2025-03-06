import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Users,
  Files,
  MessageSquare,
  Plus,
  Upload,
  UserPlus,
  FileBarChart,
  Edit,
  Trash2,
  X
} from 'lucide-react';

interface BlockProps {
  title: string;
  icon: React.ElementType;
  color: string;
  count: string;
  onAdd: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  items: Array<{ id: number; name: string; description?: string }>;
}

const AdminBlock = ({ title, icon: Icon, color, count, onAdd, onEdit, onDelete, items }: BlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${color}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-gray-600">{count} itens</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className={`p-2 rounded-lg ${color} text-white hover:opacity-90 transition-opacity`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          <div className="p-4 max-h-64 overflow-y-auto">
            {items.length > 0 ? (
              <ul className="space-y-2">
                {items.map((item) => (
                  <li 
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(item.id)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-4">Nenhum item encontrado</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Mock data
  const mockData = {
    locations: [
      { id: 1, name: 'Macapá', description: 'Capital do Amapá' },
      { id: 2, name: 'Santana', description: 'Cidade portuária' },
      { id: 3, name: 'Oiapoque', description: 'Fronteira com a Guiana Francesa' }
    ],
    users: [
      { id: 1, name: 'João Silva', description: 'Administrador' },
      { id: 2, name: 'Maria Santos', description: 'Editor' }
    ],
    documents: [
      { id: 1, name: 'História do Amapá.pdf', description: '2.5 MB' },
      { id: 2, name: 'Relatório 2024.xlsx', description: '1.8 MB' }
    ],
    collaborations: [
      { id: 1, name: 'Fotos antigas do Macapá', description: 'Pendente' },
      { id: 2, name: 'Documentos históricos', description: 'Em análise' }
    ]
  };

  const handleAdd = (type: string) => {
    setActiveModal(`add-${type}`);
    console.log(`Adding new ${type}`);
  };

  const handleEdit = (type: string, id: number) => {
    setActiveModal(`edit-${type}`);
    console.log(`Editing ${type} with id ${id}`);
  };

  const handleDelete = (type: string, id: number) => {
    console.log(`Deleting ${type} with id ${id}`);
  };

  const blocks = [
    {
      title: 'Localidades',
      icon: MapPin,
      color: 'bg-blue-500',
      count: mockData.locations.length.toString(),
      items: mockData.locations,
      type: 'location'
    },
    {
      title: 'Usuários',
      icon: Users,
      color: 'bg-green-500',
      count: mockData.users.length.toString(),
      items: mockData.users,
      type: 'user'
    },
    {
      title: 'Documentos',
      icon: Files,
      color: 'bg-purple-500',
      count: mockData.documents.length.toString(),
      items: mockData.documents,
      type: 'document'
    },
    {
      title: 'Colaborações',
      icon: MessageSquare,
      color: 'bg-yellow-500',
      count: mockData.collaborations.length.toString(),
      items: mockData.collaborations,
      type: 'collaboration'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('admin.dashboard.title')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blocks.map((block) => (
          <AdminBlock
            key={block.type}
            title={block.title}
            icon={block.icon}
            color={block.color}
            count={block.count}
            items={block.items}
            onAdd={() => handleAdd(block.type)}
            onEdit={(id) => handleEdit(block.type, id)}
            onDelete={(id) => handleDelete(block.type, id)}
          />
        ))}
      </div>

      {/* Activity Feed */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">{t('admin.dashboard.recentActivity')}</h2>
        <div className="space-y-4">
          {[
            { id: 1, action: 'Novo documento adicionado', user: 'Maria Silva', time: '2 minutos atrás' },
            { id: 2, action: 'Localidade atualizada', user: 'João Santos', time: '1 hora atrás' },
            { id: 3, action: 'Nova colaboração recebida', user: 'Ana Costa', time: '3 horas atrás' }
          ].map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-gray-500">
                  {activity.user} • {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
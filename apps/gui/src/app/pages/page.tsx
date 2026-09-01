import { Layout } from '../components/layout';
import { PageHeading, Collapsable, IconButton } from '../shared/components';

export default function Home() {
    const collapsableItems = [
        {
            id: 1,
            title: 'Getting Started',
            content: <p>Content for getting started section</p>,
            icon: '🚀'
        },
        {
            id: 2,
            title: 'Features',
            content: <p>Content for features section</p>,
            icon: '✨'
        },
        {
            id: 3,
            title: 'Support',
            content: <p>Content for support section</p>,
            icon: '💡'
        }
    ];

    return (
        <Layout>
            <PageHeading
                title="Dashboard"
                subtitle="Welcome to your dashboard"
            >
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    New Item
                </button>
            </PageHeading>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-medium">Stats 1</h3>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-medium">Stats 2</h3>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-medium">Stats 3</h3>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <Collapsable
                    items={collapsableItems}
                    direction="vertical"
                    defaultExpanded={1}
                />
            </div>

            <div className="mt-6 flex gap-3">
                <IconButton
                    icon="🏠"
                    label="Home"
                    variant="full"
                />
                <IconButton
                    icon="🔍"
                    label="Search"
                    variant="icon-only"
                />
            </div>
        </Layout>
    );
}
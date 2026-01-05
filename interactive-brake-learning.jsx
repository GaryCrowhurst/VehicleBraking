import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Check, Lock, Unlock, Download, RefreshCw, Info } from 'lucide-react';

const InteractiveBrakeComponents = () => {
  const [selectedSystem, setSelectedSystem] = useState('disc');
  const [components, setComponents] = useState({});
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Component definitions with AI-generated content
  const componentDefinitions = {
    disc: {
      'brake-disc': {
        name: 'Brake Disc (Rotor)',
        visualDescription: 'Circular metal disc with ventilation vanes between two friction surfaces, typically 250-380mm diameter, with mounting holes in the center hub',
        function: 'Provides friction surface for brake pads to clamp against, converting kinetic energy to heat',
        operation: 'Rotates with the wheel. When brakes applied, pads clamp both faces creating friction. Ventilation vanes dissipate heat',
        hints: {
          visualDescription: 'Describe what you see: shape, color, size, any holes or vents',
          function: 'What does this component do? What is its job?',
          operation: 'How does it work? What happens when brakes are applied?'
        }
      },
      'brake-caliper': {
        name: 'Brake Caliper',
        visualDescription: 'Red or metallic housing that straddles the disc edge, rectangular shape with pistons visible, bleeder valve on top',
        function: 'Houses pistons and brake pads; converts hydraulic pressure into mechanical clamping force',
        operation: 'Straddles disc at top. Hydraulic pressure pushes pistons outward, forcing pads against disc faces',
        hints: {
          visualDescription: 'What color is it? Where is it positioned? What shape?',
          function: 'What does the caliper contain? What does it convert?',
          operation: 'Where is it mounted? What moves when brakes are applied?'
        }
      },
      'brake-pads': {
        name: 'Brake Pads',
        visualDescription: 'Flat rectangular blocks with golden/brown friction material bonded to steel backing plate, about 10mm thick when new',
        function: 'Create friction against disc faces to slow the vehicle through contact and heat generation',
        operation: 'Positioned either side of disc. Pistons push pads against rotating disc creating friction and heat',
        hints: {
          visualDescription: 'What color is the friction material? How thick? What is the backing made of?',
          function: 'What do pads create? Against what surface?',
          operation: 'Where are they positioned? What pushes them?'
        }
      },
      'caliper-pistons': {
        name: 'Caliper Pistons',
        visualDescription: 'Cylindrical metal pistons (silver or blue), 30-60mm diameter, with rubber dust boots at the base',
        function: 'Push brake pads against disc faces using hydraulic pressure from the brake fluid',
        operation: 'Sit behind pads inside caliper. Hydraulic pressure forces them outward, moving pads toward disc',
        hints: {
          visualDescription: 'What shape? What material? What protects them?',
          function: 'What do pistons push? What type of pressure moves them?',
          operation: 'Where are they located? Which direction do they move?'
        }
      },
      'wheel-hub': {
        name: 'Wheel Hub Assembly',
        visualDescription: 'Central circular mounting with 4-6 wheel studs protruding, gray metal, contains bearing assembly in center',
        function: 'Mounting point for brake disc and wheel; contains bearings that allow rotation',
        operation: 'Disc bolts to hub flange. Hub rotates on bearings. Wheel mounts over disc with lug nuts',
        hints: {
          visualDescription: 'How many studs? What color? What is in the center?',
          function: 'What mounts to it? What does it contain?',
          operation: 'What connects to the hub? How does it rotate?'
        }
      },
      'brake-fluid': {
        name: 'Brake Fluid',
        visualDescription: 'Clear to amber hydraulic fluid in translucent reservoir, glycol-based with specific DOT rating visible on cap',
        function: 'Transmits hydraulic pressure from master cylinder to calipers throughout the brake system',
        operation: 'Master cylinder pressurizes fluid when pedal pressed. Incompressible fluid instantly transfers force to all calipers',
        hints: {
          visualDescription: 'What color? Where is it stored? What is on the cap?',
          function: 'What does it transmit? From where to where?',
          operation: 'What pressurizes it? What property allows force transfer?'
        }
      }
    },
    drum: {
      'brake-drum': {
        name: 'Brake Drum',
        visualDescription: 'Cylindrical metal housing, 200-300mm diameter, open at back, smooth inner friction surface',
        function: 'Provides friction surface and houses brake shoes; rotates with the wheel',
        operation: 'Rotates with wheel. Shoes press outward against inner surface when hydraulic pressure applied',
        hints: {
          visualDescription: 'What shape? How big? Where is it open?',
          function: 'What does it contain? What does it provide?',
          operation: 'What rotates with it? What presses against it?'
        }
      },
      'brake-shoes': {
        name: 'Brake Shoes',
        visualDescription: 'Semi-circular curved metal with brown/black friction lining on outer edge, leading and trailing shoe arrangement',
        function: 'Press against drum inner surface to create friction and slow the vehicle',
        operation: 'Wheel cylinder pushes shoes outward against drum. Leading shoe self-servo action provides most force',
        hints: {
          visualDescription: 'What shape? What covers the surface? How many?',
          function: 'What do they press against? What do they create?',
          operation: 'What pushes them? Which shoe does more work?'
        }
      },
      'wheel-cylinder': {
        name: 'Wheel Cylinder',
        visualDescription: 'Small cylindrical housing at top of backing plate, two pistons visible at ends, bleeder valve on top',
        function: 'Converts hydraulic pressure to mechanical force that pushes brake shoes outward',
        operation: 'Located at top between shoes. Hydraulic pressure forces two pistons outward simultaneously',
        hints: {
          visualDescription: 'Where is it positioned? What is visible? What is on top?',
          function: 'What type of pressure? What does it push?',
          operation: 'Where is it located? How many pistons? Which direction?'
        }
      },
      'return-springs': {
        name: 'Return Springs',
        visualDescription: 'Heavy coil springs connecting top and bottom of brake shoes, typically silver or colored metal',
        function: 'Pull brake shoes away from drum when hydraulic pressure is released',
        operation: 'Strong tension pulls shoes inward when pedal released, preventing brake drag',
        hints: {
          visualDescription: 'What connects them? What material? Where positioned?',
          function: 'What do they pull? When do they activate?',
          operation: 'Which direction do they pull? What do they prevent?'
        }
      },
      'adjuster': {
        name: 'Adjuster Mechanism',
        visualDescription: 'Threaded rod or star wheel at bottom between shoes, can be rotated with brake spoon tool',
        function: 'Maintains correct clearance between shoes and drum as linings wear',
        operation: 'Extends as linings wear thin. Automatic types ratchet during reverse braking. Manual types need periodic adjustment',
        hints: {
          visualDescription: 'Where is it located? What shape? What tool adjusts it?',
          function: 'What does it maintain? What wears?',
          operation: 'When does it extend? What are the two types?'
        }
      }
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('brakeComponentsProgress');
    if (saved) {
      setComponents(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever components change
  useEffect(() => {
    localStorage.setItem('brakeComponentsProgress', JSON.stringify(components));
  }, [components]);

  const getComponentData = (componentId) => {
    return components[`${selectedSystem}-${componentId}`] || {
      image: null,
      userOperation: '',
      userVisualDescription: '',
      userFunction: '',
      completed: false
    };
  };

  const handleImageUpload = (event, componentId) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateComponent(componentId, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateComponent = (componentId, field, value) => {
    const key = `${selectedSystem}-${componentId}`;
    const currentData = components[key] || {};
    const newData = { ...currentData, [field]: value };

    // Check if component is complete (has image + at least one user input)
    const hasImage = newData.image;
    const hasUserInput = newData.userOperation || newData.userVisualDescription || newData.userFunction;
    newData.completed = hasImage && hasUserInput;

    setComponents({
      ...components,
      [key]: newData
    });
  };

  const autoFillMissingFields = (componentId) => {
    const key = `${selectedSystem}-${componentId}`;
    const currentData = components[key] || {};
    const definition = componentDefinitions[selectedSystem][componentId];

    // Auto-fill any empty fields
    const updatedData = {
      ...currentData,
      userVisualDescription: currentData.userVisualDescription || definition.visualDescription,
      userFunction: currentData.userFunction || definition.function,
      userOperation: currentData.userOperation || definition.operation,
      autoFilled: true
    };

    setComponents({
      ...components,
      [key]: updatedData
    });
  };

  const isComponentComplete = (componentId) => {
    const data = getComponentData(componentId);
    return data.completed;
  };

  const getProgress = () => {
    const systemComponents = Object.keys(componentDefinitions[selectedSystem]);
    const completed = systemComponents.filter(id => isComponentComplete(id)).length;
    return Math.round((completed / systemComponents.length) * 100);
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setComponents({});
      localStorage.removeItem('brakeComponentsProgress');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(components, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'brake-components-progress.json';
    link.click();
  };

  const ComponentCard = ({ componentId, definition }) => {
    const data = getComponentData(componentId);
    const isComplete = isComponentComplete(componentId);

    return (
      <div 
        className={`component-card ${isComplete ? 'complete' : 'incomplete'}`}
        onClick={() => setSelectedComponent(componentId)}
      >
        <div className="card-status">
          {isComplete ? <Check size={20} /> : <Lock size={20} />}
        </div>
        
        <div className="card-image-area">
          {data.image ? (
            <img src={data.image} alt={definition.name} className="card-image" />
          ) : (
            <div className="card-image-placeholder">
              <Camera size={40} />
              <span>No Image</span>
            </div>
          )}
        </div>

        <h3 className="card-title">{definition.name}</h3>
        
        <div className="card-fields">
          <div className={`field ${data.userVisualDescription ? 'filled' : 'empty'}`}>
            Visual Description {data.userVisualDescription && '✓'}
          </div>
          <div className={`field ${data.userFunction ? 'filled' : 'empty'}`}>
            Function {data.userFunction && '✓'}
          </div>
          <div className={`field ${data.userOperation ? 'filled' : 'empty'}`}>
            Operation {data.userOperation && '✓'}
          </div>
        </div>
      </div>
    );
  };

  const ComponentEditor = ({ componentId }) => {
    const definition = componentDefinitions[selectedSystem][componentId];
    const data = getComponentData(componentId);

    return (
      <div className="editor-overlay" onClick={() => setSelectedComponent(null)}>
        <div className="editor-content" onClick={(e) => e.stopPropagation()}>
          <div className="editor-header">
            <h2>{definition.name}</h2>
            <button className="close-btn" onClick={() => setSelectedComponent(null)}>×</button>
          </div>

          <div className="editor-body">
            {/* Image Upload Section */}
            <div className="editor-section">
              <label className="section-label">📸 Component Image *</label>
              <div className="image-upload-area">
                {data.image ? (
                  <div className="uploaded-image-container">
                    <img src={data.image} alt="Uploaded component" className="uploaded-image" />
                    <button 
                      className="change-image-btn"
                      onClick={() => updateComponent(componentId, 'image', null)}
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div className="upload-buttons">
                    <button 
                      className="upload-btn camera-btn"
                      onClick={() => cameraInputRef.current.click()}
                    >
                      <Camera size={24} />
                      <span>Take Photo</span>
                    </button>
                    <button 
                      className="upload-btn file-btn"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <Upload size={24} />
                      <span>Upload Image</span>
                    </button>
                  </div>
                )}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleImageUpload(e, componentId)}
                  style={{ display: 'none' }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, componentId)}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* Visual Description */}
            <div className="editor-section">
              <label className="section-label">👁️ Visual Description</label>
              <p className="hint">{definition.hints.visualDescription}</p>
              <textarea
                className="editor-input"
                value={data.userVisualDescription || ''}
                onChange={(e) => updateComponent(componentId, 'userVisualDescription', e.target.value)}
                placeholder="Describe what you see..."
                rows={3}
              />
            </div>

            {/* Function */}
            <div className="editor-section">
              <label className="section-label">⚙️ Function</label>
              <p className="hint">{definition.hints.function}</p>
              <textarea
                className="editor-input"
                value={data.userFunction || ''}
                onChange={(e) => updateComponent(componentId, 'userFunction', e.target.value)}
                placeholder="What does this component do?"
                rows={3}
              />
            </div>

            {/* Operation */}
            <div className="editor-section">
              <label className="section-label">🔧 Operation</label>
              <p className="hint">{definition.hints.operation}</p>
              <textarea
                className="editor-input"
                value={data.userOperation || ''}
                onChange={(e) => updateComponent(componentId, 'userOperation', e.target.value)}
                placeholder="How does it work?"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="editor-actions">
              <button 
                className="action-btn auto-fill-btn"
                onClick={() => autoFillMissingFields(componentId)}
                disabled={!data.image}
              >
                <Unlock size={18} />
                Auto-Fill Missing Fields
              </button>
              <button 
                className="action-btn save-btn"
                onClick={() => setSelectedComponent(null)}
                disabled={!isComponentComplete(componentId)}
              >
                <Check size={18} />
                {isComponentComplete(componentId) ? 'Complete ✓' : 'Need Image + 1 Field'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <h1>🔧 Brake Components Learning</h1>
        <p>City & Guilds 7290 - Interactive Workbook</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${getProgress()}%` }}>
            <span className="progress-text">{getProgress()}% Complete</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {showInstructions && (
        <div className="instructions-banner">
          <Info size={20} />
          <div>
            <strong>How it works:</strong> Take or upload an image of each component, then fill in at least ONE field. 
            The app will auto-fill the rest! Complete all components to master brake systems.
          </div>
          <button onClick={() => setShowInstructions(false)}>✕</button>
        </div>
      )}

      {/* System Selector */}
      <div className="system-selector">
        <button 
          className={`system-btn ${selectedSystem === 'disc' ? 'active' : ''}`}
          onClick={() => setSelectedSystem('disc')}
        >
          Disc Brake System
        </button>
        <button 
          className={`system-btn ${selectedSystem === 'drum' ? 'active' : ''}`}
          onClick={() => setSelectedSystem('drum')}
        >
          Drum Brake System
        </button>
      </div>

      {/* Action Buttons */}
      <div className="action-bar">
        <button className="top-action-btn" onClick={resetProgress}>
          <RefreshCw size={16} />
          Reset Progress
        </button>
        <button className="top-action-btn" onClick={exportData}>
          <Download size={16} />
          Export Data
        </button>
      </div>

      {/* Components Grid */}
      <div className="components-grid">
        {Object.entries(componentDefinitions[selectedSystem]).map(([id, definition]) => (
          <ComponentCard key={id} componentId={id} definition={definition} />
        ))}
      </div>

      {/* Editor Modal */}
      {selectedComponent && (
        <ComponentEditor componentId={selectedComponent} />
      )}

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 1rem;
          padding-bottom: 3rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .app-header {
          background: linear-gradient(90deg, #dc2626 0%, #ef4444 100%);
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          color: white;
        }

        .app-header h1 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .app-header p {
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .progress-bar {
          margin-top: 1rem;
          background: rgba(255, 255, 255, 0.2);
          height: 30px;
          border-radius: 15px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #059669 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: width 0.3s ease;
          min-width: 60px;
        }

        .progress-text {
          font-weight: bold;
          font-size: 0.85rem;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }

        .instructions-banner {
          background: #fef3c7;
          border: 2px solid #fbbf24;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .instructions-banner svg {
          color: #d97706;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .instructions-banner button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #92400e;
          margin-left: auto;
        }

        .system-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .system-btn {
          padding: 1rem;
          background: white;
          border: 3px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .system-btn.active {
          background: linear-gradient(90deg, #dc2626 0%, #ef4444 100%);
          border-color: #dc2626;
          color: white;
        }

        .action-bar {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .top-action-btn {
          flex: 1;
          padding: 0.75rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .top-action-btn:hover {
          border-color: #dc2626;
          background: #fef2f2;
        }

        .components-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .component-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.2s;
          border: 3px solid transparent;
          position: relative;
        }

        .component-card.incomplete {
          opacity: 0.6;
          filter: grayscale(0.5);
        }

        .component-card.complete {
          border-color: #10b981;
        }

        .component-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .card-status {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .complete .card-status {
          background: #10b981;
          color: white;
        }

        .incomplete .card-status {
          background: #ef4444;
          color: white;
        }

        .card-image-area {
          height: 180px;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-image-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #9ca3af;
        }

        .card-title {
          padding: 1rem;
          font-size: 1.1rem;
          color: #1f2937;
          background: #fef2f2;
          border-bottom: 2px solid #fecaca;
        }

        .card-fields {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .field {
          padding: 0.5rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .field.empty {
          background: #1f2937;
          color: #6b7280;
        }

        .field.filled {
          background: #d1fae5;
          color: #065f46;
        }

        /* Editor Modal */
        .editor-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1000;
          overflow-y: auto;
          padding: 1rem;
        }

        .editor-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          margin: 2rem auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .editor-header {
          background: linear-gradient(90deg, #dc2626 0%, #ef4444 100%);
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .editor-header h2 {
          color: white;
          font-size: 1.3rem;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .editor-body {
          padding: 1.5rem;
          max-height: calc(100vh - 200px);
          overflow-y: auto;
        }

        .editor-section {
          margin-bottom: 1.5rem;
        }

        .section-label {
          display: block;
          font-weight: 700;
          font-size: 1rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .hint {
          font-size: 0.85rem;
          color: #6b7280;
          font-style: italic;
          margin-bottom: 0.75rem;
        }

        .image-upload-area {
          background: #f9fafb;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
        }

        .upload-buttons {
          display: flex;
          gap: 1rem;
        }

        .upload-btn {
          flex: 1;
          padding: 1rem;
          border: 2px solid #dc2626;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #dc2626;
          transition: all 0.2s;
        }

        .upload-btn:hover {
          background: #fef2f2;
          transform: scale(1.02);
        }

        .uploaded-image-container {
          position: relative;
        }

        .uploaded-image {
          width: 100%;
          max-height: 300px;
          object-fit: contain;
          border-radius: 8px;
        }

        .change-image-btn {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .editor-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.2s;
        }

        .editor-input:focus {
          outline: none;
          border-color: #dc2626;
        }

        .editor-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 2rem;
        }

        .action-btn {
          padding: 1rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .auto-fill-btn {
          background: #3b82f6;
          color: white;
        }

        .auto-fill-btn:hover:not(:disabled) {
          background: #2563eb;
        }

        .auto-fill-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .save-btn {
          background: #10b981;
          color: white;
        }

        .save-btn:hover:not(:disabled) {
          background: #059669;
        }

        .save-btn:disabled {
          background: #ef4444;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .components-grid {
            grid-template-columns: 1fr;
          }

          .system-selector {
            grid-template-columns: 1fr;
          }

          .upload-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default InteractiveBrakeComponents;
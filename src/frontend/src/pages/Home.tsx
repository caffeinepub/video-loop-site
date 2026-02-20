import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
// Video components hidden - functionality preserved for future use
// import { MasterPresentationPlayer } from '@/components/MasterPresentationPlayer';
// import { MasterVideoUploader } from '@/components/MasterVideoUploader';
import { MetricsDashboard } from '@/components/MetricsDashboard';
import { Play, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// Video queries hidden - functionality preserved for future use
// import { useGetMasterVideo, useGetMasterVideoBlob } from '@/hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';

export function Home() {
  const [activeScene, setActiveScene] = useState(6);
  // Video state hidden - functionality preserved for future use
  // const [persistenceError, setPersistenceError] = useState<string | null>(null);
  // const { data: masterVideo, isLoading: isMasterVideoLoading, isFetching: isMasterVideoFetching } = useGetMasterVideo();
  // const { data: masterVideoBlob, isLoading: isBlobLoading } = useGetMasterVideoBlob();
  const queryClient = useQueryClient();

  // Video upload handler hidden - functionality preserved for future use
  // const handleUploadComplete = async () => {
  //   console.log('[Home:MasterPresentation] Upload complete callback triggered at', new Date().toISOString());
  //   
  //   // Clear any previous persistence errors
  //   setPersistenceError(null);
  //   
  //   // Invalidate and refetch the master video queries to update the UI
  //   console.log('[Home:MasterPresentation] Invalidating queries...');
  //   await queryClient.invalidateQueries({ queryKey: ['masterVideo'] });
  //   await queryClient.invalidateQueries({ queryKey: ['masterVideoBlob'] });
  //   
  //   console.log('[Home:MasterPresentation] Queries invalidated, refetch will trigger automatically');
  //   
  //   // Wait a moment for queries to refetch, then verify persistence
  //   setTimeout(async () => {
  //     console.log('[Home:MasterPresentation] Verifying video persistence...');
  //     
  //     // Refetch to get the latest data
  //     const result = await queryClient.refetchQueries({ queryKey: ['masterVideo'] });
  //     const videoData = result[0]?.data;
  //     
  //     console.log('[Home:MasterPresentation] Verification result:', {
  //       hasData: !!videoData,
  //       isComplete: videoData?.isComplete,
  //       isPersistent: videoData?.isPersistent,
  //     });
  //     
  //     // Check if video was actually persisted
  //     if (!videoData || !videoData.isPersistent) {
  //       console.error('[Home:MasterPresentation] Video upload succeeded but persistence failed');
  //       setPersistenceError('Upload completed but the video could not be saved. Please try uploading again.');
  //     }
  //   }, 3000); // Wait 3 seconds for backend to finalize
  // };

  const scenes = [
    { id: 1, label: '1' },
    { id: 2, label: '2' },
    { id: 3, label: '3' },
    { id: 4, label: '4' },
    { id: 5, label: '5' },
    { id: 6, label: '6' },
    { id: 7, label: '7' },
  ];

  const getSceneContent = (sceneId: number) => {
    switch (sceneId) {
      case 1:
        return {
          label: 'SCENE 01',
          title: 'Prenatal Development',
          subtitle: 'Fetal Skeletal Formation & Early Age Markers',
          description: 'Prenatal age estimation relies on the predictable sequence of ossification centers appearing during fetal development. Crown-rump length measurements combined with the emergence of primary ossification centers in long bones provide accurate gestational age estimates. Key markers include the clavicle (first bone to ossify at 5-6 weeks), followed by mandible, maxilla, and vertebral arches. By the second trimester, diaphyseal lengths of femur, tibia, and humerus become reliable indicators of fetal age.',
          tags: ['OSSIFICATION CENTERS', 'CROWN-RUMP LENGTH', 'FETAL BONE FORMATION'],
          image: '/assets/generated/scene1-prenatal.dim_600x400.png',
          imageBackground: 'from-indigo-100 to-purple-50',
        };
      case 2:
        return {
          label: 'SCENE 02',
          title: 'Infant Development',
          subtitle: 'Fetal Skull & Prenatal Age Estimation',
          description: 'The fetal skull exhibits distinct anatomical features critical for age estimation. Cranial sutures (coronal, sagittal, lambdoid) and fontanels (anterior and posterior) provide developmental markers. The biparietal diameter measurement (9.5 cm shown) is a key metric for determining gestational age and neonatal maturity.',
          tags: ['FONTANEL CLOSURE', 'BIPARIETAL DIAMETER', 'PRENATAL MARKERS'],
          image: '/assets/image-10.png',
          imageBackground: 'from-amber-100 to-orange-50',
        };
      case 3:
        return {
          label: 'SCENE 03',
          title: 'Childhood Growth',
          subtitle: 'Hand & Foot Ossification',
          description: 'Ossification centers appear in predictable sequences. The distal radius ossifies at ~1 year, while the distal ulna appears around age 3 in females and 6 in males.',
          tags: ['EPIPHYSEAL FUSION', '5TH METATARSAL', '±1-2 YEAR ERROR'],
          image: '/assets/generated/scene3-hand-foot.dim_600x600.png',
          imageBackground: 'from-blue-950/50 to-blue-900/30',
        };
      case 4:
        return {
          label: 'SCENE 04',
          title: 'Adolescent Maturation',
          subtitle: 'Brain Development & Cognitive Maturity',
          description: 'The adolescent brain undergoes significant structural changes, particularly in the prefrontal cortex responsible for executive function and decision-making. Myelination continues through the mid-20s, with gray matter volume peaking around age 12 in females and 14 in males. MRI studies reveal progressive synaptic pruning and white matter maturation, providing neurological markers for developmental age assessment.',
          tags: ['PREFRONTAL CORTEX', 'MYELINATION', 'SYNAPTIC PRUNING'],
          image: '/assets/generated/scene4-brain-model.dim_600x400.png',
          imageBackground: 'from-purple-100 to-pink-50',
        };
      case 5:
        return {
          label: 'SCENE 05',
          title: 'Young Adult Markers',
          subtitle: 'Pubic Symphysis & Sternal Rib Analysis',
          description: 'The pubic symphysis undergoes predictable morphological changes from adolescence through middle age. The Suchey-Brooks method analyzes six phases of symphyseal surface transformation, providing age estimates with ±5-10 year accuracy. Complementary sternal rib end analysis examines costal cartilage ossification patterns, particularly useful for individuals aged 20-70 years.',
          tags: ['SUCHEY-BROOKS', 'SYMPHYSEAL SURFACE', 'COSTAL CARTILAGE'],
          image: '/assets/generated/scene5-pubic-symphysis.dim_600x400.png',
          imageBackground: 'from-green-100 to-emerald-50',
        };
      case 6:
        return {
          label: 'SCENE 06',
          title: 'Middle Age Indicators',
          subtitle: 'Cranial Suture Closure & Degenerative Changes',
          description: 'Cranial suture closure follows a predictable pattern, with the sagittal suture typically closing between ages 22-35, followed by coronal (24-38) and lambdoid (26-42) sutures. Osteoarthritic changes in weight-bearing joints provide additional age markers, with cartilage degradation, osteophyte formation, and subchondral sclerosis becoming increasingly prevalent after age 40.',
          tags: ['SUTURE CLOSURE', 'OSTEOARTHRITIS', 'JOINT DEGENERATION'],
          image: '/assets/generated/scene6-cranial-sutures.dim_600x400.png',
          imageBackground: 'from-orange-100 to-red-50',
        };
      case 7:
        return {
          label: 'SCENE 07',
          title: 'Advanced Age Assessment',
          subtitle: 'Multivariate Analysis & Statistical Models',
          description: 'Modern forensic age estimation employs multivariate statistical models combining multiple skeletal indicators. Bayesian approaches integrate prior population data with observed morphological features, improving accuracy and providing confidence intervals. Machine learning algorithms analyze complex patterns across dental development, epiphyseal fusion, and degenerative changes to generate comprehensive age profiles.',
          tags: ['BAYESIAN ANALYSIS', 'MACHINE LEARNING', 'CONFIDENCE INTERVALS'],
          image: '/assets/generated/scene7-multivariate.dim_800x500.png',
          imageBackground: 'from-cyan-100 to-blue-50',
        };
      default:
        return {
          label: 'SCENE 06',
          title: 'Middle Age Indicators',
          subtitle: 'Cranial Suture Closure & Degenerative Changes',
          description: 'Cranial suture closure follows a predictable pattern, with the sagittal suture typically closing between ages 22-35, followed by coronal (24-38) and lambdoid (26-42) sutures. Osteoarthritic changes in weight-bearing joints provide additional age markers, with cartilage degradation, osteophyte formation, and subchondral sclerosis becoming increasingly prevalent after age 40.',
          tags: ['SUTURE CLOSURE', 'OSTEOARTHRITIS', 'JOINT DEGENERATION'],
          image: '/assets/generated/scene6-cranial-sutures.dim_600x400.png',
          imageBackground: 'from-orange-100 to-red-50',
        };
    }
  };

  const currentScene = getSceneContent(activeScene);

  // Video state checks hidden - functionality preserved for future use
  // const hasCompleteVideo = masterVideo?.isComplete === true && masterVideo?.isPersistent === true;
  // const hasBlobAvailable = !!masterVideoBlob;
  // 
  // // Log state for debugging
  // console.log('[Home:MasterPresentation] Render state:', {
  //   hasCompleteVideo,
  //   hasBlobAvailable,
  //   isMasterVideoLoading,
  //   isMasterVideoFetching,
  //   isBlobLoading,
  //   masterVideoId: masterVideo?.id,
  //   masterVideoTitle: masterVideo?.title,
  //   masterVideoComplete: masterVideo?.isComplete,
  //   masterVideoPersistent: masterVideo?.isPersistent,
  //   persistenceError,
  // });
  //
  // // Determine whether to show uploader or player
  // const shouldShowUploader = !hasCompleteVideo || !hasBlobAvailable || persistenceError !== null;
  // const shouldShowPlayer = hasCompleteVideo && hasBlobAvailable && persistenceError === null;
  //
  // console.log('[Home:MasterPresentation] Component decision:', {
  //   shouldShowUploader,
  //   shouldShowPlayer,
  // });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center space-y-6">
              <div className="inline-block">
                <span className="text-xs font-mono tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  FORENSIC ANTHROPOLOGY
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                Skeletal Clock
              </h1>
              <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
                Decoding Age Through Bone: A Journey from Birth to Senescence
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <span className="text-xs font-mono text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded border border-blue-500/20">
                  OSSIFICATION ANALYSIS
                </span>
                <span className="text-xs font-mono text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded border border-blue-500/20">
                  EPIPHYSEAL FUSION
                </span>
                <span className="text-xs font-mono text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded border border-blue-500/20">
                  DEGENERATIVE MARKERS
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Master Presentation Section - Now with static image */}
        <section className="py-16 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-6xl">
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Master Presentation
                </h2>
                <p className="text-blue-200 max-w-2xl mx-auto">
                  Comprehensive overview of forensic age estimation methodologies
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-lg border border-blue-500/20 overflow-hidden">
                <div className="relative w-full aspect-[2/1]">
                  <img
                    src="/assets/generated/forensic-clock-hero.dim_1200x600.png"
                    alt="Forensic Age Estimation - Skeletal Clock Methodology"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-bold text-white">
                        Forensic Age Estimation Framework
                      </h3>
                      <p className="text-blue-200 max-w-3xl">
                        A comprehensive visual guide to skeletal age indicators across the human lifespan, from prenatal development through advanced age assessment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video functionality hidden - preserved for future use */}
              {/* <div className="bg-slate-800/50 rounded-lg border border-blue-500/20 p-8">
                {isMasterVideoLoading || (isMasterVideoFetching && !masterVideo) ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
                    <p className="text-blue-200">Loading master presentation...</p>
                  </div>
                ) : shouldShowPlayer ? (
                  <MasterPresentationPlayer />
                ) : (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-semibold text-white">Upload Master Presentation</h3>
                      <p className="text-sm text-blue-200">
                        No master presentation video is currently available. Upload one to get started.
                      </p>
                    </div>
                    <MasterVideoUploader 
                      onUploadComplete={handleUploadComplete}
                      persistenceError={persistenceError || undefined}
                    />
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </section>

        {/* Visual Guide Section */}
        <section id="visual-guide" className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Visual Guide
                </h2>
                <p className="text-blue-200 max-w-2xl mx-auto">
                  Interactive exploration of age estimation across the human lifespan
                </p>
              </div>

              {/* Scene Navigation */}
              <div className="flex justify-center gap-2 flex-wrap">
                {scenes.map((scene) => (
                  <Button
                    key={scene.id}
                    onClick={() => setActiveScene(scene.id)}
                    variant={activeScene === scene.id ? 'default' : 'outline'}
                    size="sm"
                    className={
                      activeScene === scene.id
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500'
                        : 'bg-slate-800/50 hover:bg-slate-700/50 text-blue-200 border-blue-500/20'
                    }
                  >
                    Scene {scene.label}
                  </Button>
                ))}
              </div>

              {/* Scene Content */}
              <div className="bg-slate-800/50 rounded-lg border border-blue-500/20 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image Side */}
                  <div className={`relative aspect-[4/3] bg-gradient-to-br ${currentScene.imageBackground}`}>
                    <img
                      src={currentScene.image}
                      alt={currentScene.title}
                      className="w-full h-full object-contain p-8"
                    />
                  </div>

                  {/* Content Side */}
                  <div className="p-8 space-y-6">
                    <div className="space-y-2">
                      <span className="text-xs font-mono tracking-wider text-blue-400">
                        {currentScene.label}
                      </span>
                      <h3 className="text-2xl font-bold text-white">
                        {currentScene.title}
                      </h3>
                      <p className="text-sm text-blue-300 font-medium">
                        {currentScene.subtitle}
                      </p>
                    </div>

                    <p className="text-blue-100 leading-relaxed text-sm">
                      {currentScene.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {currentScene.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs font-mono text-blue-300 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Forensic Report Section */}
        <section id="forensic-report" className="py-16 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-6xl">
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Forensic Report
                </h2>
                <p className="text-blue-200 max-w-2xl mx-auto">
                  Detailed analysis and documentation of skeletal age estimation findings
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-lg border border-blue-500/20 p-8">
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-xl font-semibold text-white mb-4">Executive Summary</h3>
                  <p className="text-blue-100 leading-relaxed mb-6">
                    Forensic age estimation combines multiple skeletal indicators to determine biological age with varying degrees of accuracy across the lifespan. This comprehensive analysis integrates ossification patterns, epiphyseal fusion sequences, and degenerative changes to provide evidence-based age assessments for medicolegal contexts.
                  </p>

                  <h3 className="text-xl font-semibold text-white mb-4">Methodology Overview</h3>
                  <p className="text-blue-100 leading-relaxed mb-6">
                    Age estimation methodologies vary by developmental stage. Prenatal and infant assessments rely on ossification center appearance and long bone measurements. Childhood and adolescent estimates utilize dental development and epiphyseal fusion patterns. Adult age determination employs degenerative changes in the pubic symphysis, cranial sutures, and articular surfaces.
                  </p>

                  <h3 className="text-xl font-semibold text-white mb-4">Key Findings</h3>
                  <ul className="space-y-3 text-blue-100 mb-6">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>Prenatal age estimation achieves ±1-2 week accuracy using crown-rump length and ossification center timing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>Dental development provides the most reliable age indicators for individuals aged 6 months to 21 years</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>Epiphyseal fusion sequences offer ±2-3 year accuracy during adolescence and early adulthood</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>Pubic symphysis morphology (Suchey-Brooks method) provides ±5-10 year estimates for adults aged 20-70</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>Multivariate approaches combining multiple indicators improve accuracy and reduce bias</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mb-4">Limitations and Considerations</h3>
                  <p className="text-blue-100 leading-relaxed mb-6">
                    Age estimation accuracy decreases with advancing age due to increased individual variation in degenerative processes. Population-specific standards must be applied when available, as skeletal development and aging patterns vary across ancestry groups. Environmental factors, nutrition, and health status can influence skeletal maturation rates and degenerative changes.
                  </p>

                  <h3 className="text-xl font-semibold text-white mb-4">Conclusions</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Forensic age estimation requires careful integration of multiple skeletal indicators, consideration of population variation, and acknowledgment of method limitations. While no single technique provides definitive age determination, the systematic application of validated methods yields reliable age ranges suitable for medicolegal purposes. Continued research and refinement of statistical models promise improved accuracy and reduced uncertainty in future applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Tables Section - Metrics Dashboard */}
        <section id="data-tables" className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <MetricsDashboard />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
